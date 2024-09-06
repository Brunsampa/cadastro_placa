// Função para exibir respostas formatadas
function displayResponse(elementId, message, isError = false) {
  const element = document.getElementById(elementId);
  element.innerText = message;
  element.style.color = isError ? 'red' : 'black'; // Exibe erros em vermelho
}

// Função para obter o token do localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Evento de Cadastro de Usuário
const cadastroUsuarioForm = document.getElementById('cadastroUsuarioForm');
if (cadastroUsuarioForm) {
  cadastroUsuarioForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('emailCadastro').value;
    const senha = document.getElementById('senhaCadastro').value;

    if (!email || !senha) {
      displayResponse('cadastroUsuarioResponse', 'Preencha todos os campos.', true);
      return;
    }

    try {
      const response = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password: senha })
      });

      const data = await response.json();
      if (response.ok) {
        displayResponse('cadastroUsuarioResponse', 'Usuário cadastrado com sucesso!');
      } else {
        displayResponse('cadastroUsuarioResponse', data.error, true);
      }
    } catch (error) {
      displayResponse('cadastroUsuarioResponse', 'Erro ao cadastrar usuário.', true);
    }
  });
}

// Evento de Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);  // Armazena o token localmente
        window.location.href = '/dashboard';  // Redireciona para o dashboard
      } else {
        alert('Login falhou: ' + data.message);
      }
    } catch (error) {
      alert('Erro ao fazer login.');
    }
  });
}

// Evento de cadastro de placa
const cadastroPlacaForm = document.getElementById('cadastroPlacaForm');
if (cadastroPlacaForm) {
  cadastroPlacaForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const fotoInput = document.getElementById('foto');
    const cidadeInput = document.getElementById('cidade');
    const token = getToken(); // Recuperando o token do localStorage

    if (!fotoInput.files[0] || !cidadeInput.value) {
      displayResponse('cadastroResponse', 'Preencha todos os campos.', true);
      return;
    }

    if (!token) {
      displayResponse('cadastroResponse', 'Token é necessário para cadastrar a placa.', true);
      return;
    }

    const formData = new FormData();
    formData.append('foto', fotoInput.files[0]);
    formData.append('cidade', cidadeInput.value);

    try {
      const response = await fetch('/api/placas/cadastroPlaca', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Enviando o token no cabeçalho
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        displayResponse('cadastroResponse', 'Placa cadastrada com sucesso!');
      } else {
        displayResponse('cadastroResponse', data.error, true);
      }
    } catch (error) {
      displayResponse('cadastroResponse', 'Erro ao cadastrar placa.', true);
    }
  });
}

// Evento de consulta de placa
const consultaPlacaForm = document.getElementById('consultaPlacaForm');
if (consultaPlacaForm) {
  consultaPlacaForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const placa = document.getElementById('placa').value;
    const token = getToken(); // Recuperando o token do localStorage

    if (!placa) {
      displayResponse('consultaResponse', 'Informe a placa.', true);
      return;
    }

    if (!token) {
      displayResponse('consultaResponse', 'Token é necessário para consultar a placa.', true);
      return;
    }

    try {
      const response = await fetch(`/api/placas/consulta/${encodeURIComponent(placa)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Enviando o token no cabeçalho
        },
      });
      const data = await response.json();
      if (response.ok) {
        displayResponse('consultaResponse', `Placa: ${data.placa}, Cidade: ${data.cidade}, Data: ${new Date(data.data).toLocaleString()}`);
      } else {
        displayResponse('consultaResponse', data.error, true);
      }
    } catch (error) {
      displayResponse('consultaResponse', 'Erro ao consultar placa.', true);
    }
  });
}

// Evento de gerar relatório por cidade
const relatorioCidadeForm = document.getElementById('relatorioCidadeForm');
if (relatorioCidadeForm) {
  relatorioCidadeForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const cidade = document.getElementById('cidadeRelatorio').value;
    const token = getToken(); // Recuperando o token do localStorage

    if (!cidade) {
      displayResponse('relatorioResponse', 'Informe a cidade.', true);
      return;
    }

    if (!token) {
      displayResponse('relatorioResponse', 'Token é necessário para gerar o relatório.', true);
      return;
    }

    try {
      const response = await fetch(`/api/placas/relatorio/cidade/${cidade}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Enviando o token no cabeçalho
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-${cidade}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const data = await response.json();
        displayResponse('relatorioResponse', data.error, true);
      }
    } catch (error) {
      displayResponse('relatorioResponse', 'Erro ao gerar relatório.', true);
    }
  });
}

// Evento de streaming de vídeo (público, sem token)
const videoTutorialBtn = document.getElementById('videoTutorialBtn');
if (videoTutorialBtn) {
  videoTutorialBtn.addEventListener('click', async function () {
    try {
      const response = await fetch('/api/videos/videoTutorial', {  // Removido o cabeçalho de autorização
        method: 'GET',
      });

      if (response.ok) {
        const videoBlob = await response.blob();
        const videoUrl = window.URL.createObjectURL(videoBlob);
        const videoElement = document.getElementById('videoTutorial');
        videoElement.src = videoUrl;
      } else {
        displayResponse('videoResponse', 'Erro ao carregar o vídeo.', true);
      }
    } catch (error) {
      displayResponse('videoResponse', 'Erro ao carregar o vídeo.', true);
    }
  });
}
