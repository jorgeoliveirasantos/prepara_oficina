# Dia 1

### Instale o SDK do .NET

Acesse: https://dotnet.microsoft.com/pt-br/download

### Opcionalmente, via winget

Abra o Prompt de Comando do Windows como administrador e digite este comando:

````bash
winget install Microsoft.DotNet.SDK.10
````

Baixe o Github Desktop e clone o repositório 


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