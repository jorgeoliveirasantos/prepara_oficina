# Dia 1

### Instale o SDK do .NET

Acesse: https://dotnet.microsoft.com/pt-br/download

### Opcionalmente, via winget

Abra o Prompt de Comando do Windows como administrador e digite este comando:

````bash
winget install Microsoft.DotNet.SDK.10
````

Ao final da instalação verifique se tudo ocorreu como esperado, digite o comando a seguir:

````bash
dotnet --version
````

### Instale o Visual Studio Code

Navegue até: https://code.visualstudio.com/download

---

## GitHub

### Criar conta

1. Acesse: https://github.com/signup

2. Acesse com a conta do Google ou crie uma conta nova.

### Instale o GitHub Desktop

1. Navegue até: https://desktop.github.com/download/

2. Após a instalação, abra a aplicação, vá em File --> Options --> Accounts, e faça login com a conta do GitHub.

### Clone o repositório da aula

1. Navegue até: https://github.com/jorgeoliveirasantos/prepara_oficina

2. Clique em Fork.




indo em: File --> Clone repository --> URL

Cole a URL a seguir:

https://github.com/jorgeoliveirasantos/prepara_oficina.git

Escolha a pasta de destino e clique em Clone.

Abra essa pasta no CMD.

````bash
cd "<caminho_completo_da_pasta>"
````

### Templates do .NET

Para exibir uma lista completa de templates use o comando:

````bash
dotnet new --list
````

> Seu instrutor deve lhe explicar os principais templates, para que servem e como usá-los.

mkdir dia_1
cd dia_1
dotnet new wpf -n client
cd client
:: O projeto foi criado com sucesso. Vamos compilar e executar:
dotnet run
:: limpa a tela do console
cls
:: Após encerra limpe o build:
dotnet clean
:: Agora vamos configurar o Native AOT:
dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true
:: Em seguida limpe
dotnet clean
:: Vamos criar o servidor:
cd ..
dotnet new web -n server