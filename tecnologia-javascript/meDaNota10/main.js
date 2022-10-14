const { app, BrowserWindow, nativeImage } = require("electron");

// Função que cria uma janela desktop
function createWindow() {
  // Adicionando um ícone na barra de tarefas/dock
  const icon = nativeImage.createFromPath(`${app.getAppPath()}/build/icon.png`);

  if (app.dock) {
    app.dock.setIcon(icon);
  }

  // Cria uma janela de desktop
  const win = new BrowserWindow({
    icon,
    width: 800,
    height: 600,
    webPreferences: {
      // habilita a integração do Node.js no FrontEnd
      nodeIntegration: true,
    },
  });

  // carrega a janela com o conteúdo dentro de index.html
  win.loadFile("index.html");
}

// Método vai ser chamado assim que o Electron finalizar sua inicialização
// e estiver pronto para abrir e manipular o nosso código.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.whenReady().then(createWindow);

// Quando clicarmos no botão de fechar a janela no app desktop
// O evento vai ser ouvido aqui no arquivo main.js e algum procedimento pode ser realizado
// tipo fechar alguma conexão de banco de dados por exemplo.
app.on("window-all-closed", () => {
  // No MacOS quando fecha uma janela, na verdade ela é "minimizada"
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // Esse evento é disparado pelo MacOS quando clica no ícone do aplicativo no Dock.
  // Basicamente cria a janela se não foi criada.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
