document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-login');
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    const lembrarMe = document.getElementById('lembrar-me');
    const mensagemErro = document.getElementById('mensagem-erro');

    // Função para validar o formato do email
    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Evento de submissão do formulário
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpar mensagens de erro anteriores
        mensagemErro.style.display = 'none';
        mensagemErro.innerHTML = '';

        // Validações do formulário
        if (!validarEmail(email.value)) {
            mensagemErro.innerHTML = 'Por favor, insira um email válido.';
            mensagemErro.style.display = 'block';
            return;
        }

        if (senha.value.length < 6) {
            mensagemErro.innerHTML = 'A senha deve ter no mínimo 6 caracteres.';
            mensagemErro.style.display = 'block';
            return;
        }

        // Enviar dados ao backend
        try {
            console.log('Enviando requisição para o backend...');
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.value, senha: senha.value }),
            });

            const result = await response.json();
            console.log('Resposta recebida:', result); // Logar a resposta para depuração

            if (result.status === 'success') {
                alert(result.message);

                // Armazenar token com base na opção de lembrar-me
                const storage = lembrarMe.checked ? localStorage : sessionStorage;
                storage.setItem('token', result.token);

                // Redirecionar com base no cargo
                const redirectUrl = result.cargo === 'administrador'
                    ? 'admin-dashboard.html'
                    : 'dashboard.html';
                window.location.href = redirectUrl;
            } else {
                mensagemErro.innerHTML = result.message;
                mensagemErro.style.display = 'block';
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
            mensagemErro.innerHTML = 'Erro ao conectar com o servidor. Por favor, tente novamente.';
            mensagemErro.style.display = 'block';
        }
    });
});
