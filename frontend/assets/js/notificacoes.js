// notificacoes.js - Sistema de notificações de medicamentos

(function () {
    'use strict';

    let notificationsEnabled = false;
    let checkInterval = null;

    // Inicializa o sistema quando a página carrega
    document.addEventListener('DOMContentLoaded', function () {
        verificarPermissaoNotificacoes();
        iniciarMonitoramento();
    });

    // Verifica e solicita permissão para notificações
    async function verificarPermissaoNotificacoes() {
        // Verifica se o navegador suporta notificações
        if (!('Notification' in window)) {
            console.warn('⚠️ Este navegador não suporta notificações');
            return false;
        }

        // Verifica se já tem permissão
        if (Notification.permission === 'granted') {
            notificationsEnabled = true;
            console.log('✅ Notificações habilitadas');
            return true;
        }

        // Se ainda não pediu permissão, pede agora
        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                notificationsEnabled = true;
                console.log('✅ Permissão concedida para notificações');

                // Mostra notificação de teste
                mostrarNotificacaoTeste();
                return true;
            }
        }

        console.warn('⚠️ Permissão para notificações negada');
        return false;
    }

    // Notificação de teste quando o usuário permite
    function mostrarNotificacaoTeste() {
        const notification = new Notification('🔔 Hora Certa', {
            body: 'Notificações ativadas! Você será lembrado dos seus medicamentos.',
            icon: '/assets/images/horacerta-logo.png',
            badge: '/assets/images/horacerta-logo.png',
            tag: 'teste-notificacao'
        });

        // Fecha automaticamente após 5 segundos
        setTimeout(() => notification.close(), 5000);
    }

    // Inicia o monitoramento dos horários
    function iniciarMonitoramento() {
        // Verifica a cada 30 segundos (pode ajustar)
        checkInterval = setInterval(() => {
            verificarHorariosMedicamentos();
        }, 30000); // 30 segundos

        // Verifica imediatamente ao carregar
        verificarHorariosMedicamentos();

        console.log('🔍 Monitoramento de horários iniciado');
    }

    // Verifica se há medicamentos para tomar agora
    async function verificarHorariosMedicamentos() {
        const usuarioLogado = localStorage.getItem('usuario');

        if (!usuarioLogado) {
            return;
        }

        const usuario = JSON.parse(usuarioLogado);

        try {
            // Busca medicamentos do usuário
            const response = await fetch(`http://localhost:3000/api/medicamentos/usuario/${usuario.id}`);
            const data = await response.json();

            if (data.sucesso && data.dados.length > 0) {
                verificarHorarios(data.dados);
            }

        } catch (error) {
            console.error('❌ Erro ao buscar medicamentos:', error);
        }
    }

    // Verifica quais medicamentos devem ser tomados agora
    function verificarHorarios(medicamentos) {
        const agora = new Date();
        const horaAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

        console.log(`🕐 Hora atual: ${horaAtual}`);

        medicamentos.forEach(med => {
            if (!med.horarios || med.horarios.length === 0) return;

            med.horarios.forEach((horarioObj, index) => {
                const horarioMedicamento = horarioObj.hora;

                // Verifica se é hora de tomar
                if (horarioMedicamento === horaAtual) {
                    // Verifica se já notificou recentemente
                    const jaNotificou = verificarSeJaNotificou(med._id, horarioMedicamento);

                    if (!jaNotificou) {
                        enviarNotificacao(med, horarioMedicamento);
                        marcarComoNotificado(med._id, horarioMedicamento);
                    }
                }
            });
        });
    }

    // Envia a notificação
    function enviarNotificacao(medicamento, horario) {
        if (!notificationsEnabled) {
            console.log('📵 Notificações desabilitadas');
            return;
        }

        // Verifica preferências do usuário
        const preferencias = JSON.parse(localStorage.getItem('preferencias')) || {};

        if (!preferencias.alertasMedicamentos) {
            console.log('🔕 Alertas desabilitados nas preferências');
            return;
        }

        // Cria a notificação
        const notification = new Notification('💊 Hora do Medicamento!', {
            body: `${medicamento.nome} - ${medicamento.dosagem}\nHorário: ${horario}`,
            icon: '/assets/images/medicamento.png',
            badge: '/assets/images/horacerta-logo.png',
            tag: `medicamento-${medicamento._id}-${horario}`,
            requireInteraction: true, // Fica na tela até o usuário interagir
            vibrate: preferencias.lembretesVibratorios ? [200, 100, 200] : undefined
        });

        // Toca som se habilitado
        if (preferencias.lembretesSonoros) {
            tocarSomAlerta();
        }

        // Ao clicar na notificação, abre a página de medicamentos
        notification.onclick = function () {
            window.focus();
            window.location.href = '/medicamentos';
            notification.close();
        };

        console.log(`🔔 Notificação enviada: ${medicamento.nome} às ${horario}`);
    }

    // Toca som de alerta
    function tocarSomAlerta() {
        try {
            const audio = new Audio('assets/audio/kex05hnewb9-bell-ringing-sfx-2.mp3');
            audio.play().catch(e => console.log('Não foi possível tocar o som'));
        } catch (error) {
            console.log('Erro ao tocar som:', error);
        }
    }

    // Verifica se já notificou esse medicamento nesse horário hoje
    function verificarSeJaNotificou(medicamentoId, horario) {
        const hoje = new Date().toDateString();
        const chave = `notificado-${medicamentoId}-${horario}-${hoje}`;
        return localStorage.getItem(chave) === 'true';
    }

    // Marca como já notificado
    function marcarComoNotificado(medicamentoId, horario) {
        const hoje = new Date().toDateString();
        const chave = `notificado-${medicamentoId}-${horario}-${hoje}`;
        localStorage.setItem(chave, 'true');
    }

    // Limpa notificações antigas (executa uma vez por dia)
    function limparNotificacoesAntigas() {
        const hoje = new Date().toDateString();
        const ultimaLimpeza = localStorage.getItem('ultima-limpeza-notif');

        if (ultimaLimpeza !== hoje) {
            // Remove todas as chaves de notificação antigas
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('notificado-') && !key.includes(hoje)) {
                    localStorage.removeItem(key);
                }
            });

            localStorage.setItem('ultima-limpeza-notif', hoje);
            console.log('🧹 Notificações antigas limpas');
        }
    }

    // Executa limpeza ao carregar
    limparNotificacoesAntigas();

    // Expõe função global para pedir permissão manualmente
    window.habilitarNotificacoes = verificarPermissaoNotificacoes;

    // Para o monitoramento quando a página é fechada
    window.addEventListener('beforeunload', () => {
        if (checkInterval) {
            clearInterval(checkInterval);
        }
    });

})();