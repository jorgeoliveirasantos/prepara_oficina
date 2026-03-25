# Dia 1

---

![PDV Básico | Oficina Prepara LEM](https://www.jorgesouza.com.br/files/pdv.jpg)

[PDV Básico Online | Oficina Prepara LEM](https://www.jorgesouza.com.br/prepara)

### Instale o SDK do .NET

Acesse: https://dotnet.microsoft.com/pt-br/download

### Opcionalmente, via winget

Abra o Prompt de Comando do Windows como administrador e digite este comando:

```bash
winget install Microsoft.DotNet.SDK.10
```

Ao final da instalação verifique se tudo ocorreu como esperado, digite o comando a seguir:

```bash
dotnet --version
```

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

### Fork e clone do repositório da aula

1. Navegue até: https://github.com/Prepara-Cursos-LEM/prepara_oficina.git

2. Clique em Fork e crie o fork do projeto principal.

3. No Github Desktop vá em: File --> Clone repository --> Github.com

4. Selecione seu fork, escolha a pasta de destino e clique em Clone.

5. Abra essa pasta no CMD.

```bash
cd "<caminho_completo_da_pasta>"
```
6. Com o CMD na pasta do repositório, navegue até a pasta do projeto:

```bash
cd "dia_1"
cd "pdv_basico"
```

7. Abra a pasta no Visual Studio Code.

```bash
code .
```

### Templates do .NET

Para exibir uma lista completa de templates use o comando:

````bash
dotnet new --list
````

> Seu instrutor deve lhe explicar os principais templates, para que servem e como usá-los.

### Iniciando projeto

```bash
dotnet new web
```

> Seu instrutor deve lhe explicar os principais arquivos gerados e sua utilidade.

### Iniciando projeto

```bash
dotnet new web
```
1. Abra a pasta no Visual Studio Code:

```bash
code .
```
Seu instrutor deve lhe explicar os principais arquivos gerados e sua utilidade.

Execute a aplicação com o comando a seguir:

```bash
dotnet run
```

E, no navegador, navegue até o caminho exibido no terminal. Para encerrar a aplicação pressione Ctrl+C no terminal do CMD.

### Alterações

Remova a linha de código a seguir:

```CSharp
app.MapGet("/", () => "Hello World!");
```

E adicione duas novas:

```CSharp
app.UseDefaultFiles();
app.UseStaticFiles();
```

Estas linhas de código farão com que a aplicação sirva para o navegador, todo o conteúdo existente dentro da pasta wwwroot. Reinicie a aplicação para verificar as alterações. Para

```CSharp
dotnet run
```

---

## Definições

### API Mínima

Uma Minimal API em ASP.NET* é uma forma simplificada de criar APIs HTTP usando o framework ASP.NET* Core, com o mínimo de configuração e código possível.

Em vez de usar a estrutura tradicional com Controllers, Models e múltiplos arquivos, você define rotas e comportamentos diretamente em um único arquivo (geralmente o `Program.cs`).

Exemplo básico

```CSharp
var app = WebApplication.CreateBuilder(args).Build();
app.MapGet("/", () => "Hello World!");
app.Run();
```

Nesse exemplo:

1. MapGet define uma rota HTTP GET
2. A resposta é retornada diretamente por uma função lambda

### Características

1. Simples e direto: menos código.
2. Alta performance: aproveita o pipeline leve do ASP.NET Core.
3. Ideal para:
    a. Microservices
    b. APIs pequenas
    c. Protótipos rápidos

Use Minimal APIs quando:

1. Precisa de algo rápido e leve.
2. A aplicação é pequena ou média.
3. Não precisa de muita organização em camadas.

Evite quando:

1. O projeto é grande e complexo (corporativo)
2. Precisa de forte separação de responsabilidades.
3. ASP.NET Core: Todo o conjunto de recursos do .NET para desenvolvimento para web.

### Endpoint

Um endpoint é um ponto de acesso da API, basicamente uma URL + método HTTP que executa uma ação.

Em Minimal API, você define endpoints diretamente no código:

```CSharp
app.MapGet("/produtos", () => "Lista de produtos");
```

1. /produtos → rota (URL)
2. MapGet → método HTTP (GET)
3. A função → o que será executado (“Lista de produtos”).

Ou seja: o endpoint é “onde” e “como” o cliente conversa com sua API.

### Cliente

O cliente é quem faz a requisição para a API. Pode ser:

1. Um navegador (Chrome, Edge).
2. Um app mobile.
3. Uma aplicação desktop.
4. Ferramentas como Postman.

Exemplo, um cliente faz:

GET https://minhaapi.com/produtos

O cliente envia pedidos e espera respostas.

### Servidor

O servidor é quem recebe a requisição, processa e responde.

No caso de uma Minimal API:

1. É a aplicação ASP.NET rodando.
2. Contém os endpoints mapeados.
3. Executa a lógica definida.

Por exemplo:
```CSharp
app.MapGet("/produtos", () => {
    return new[] { "Notebook", "Mouse" }
});
```

O servidor:

1. Recebe a requisição do cliente.
2. Executa o endpoint correspondente.
3. Retorna a resposta (dados, status, etc.).

Resumo simples:

1. Cliente → faz a requisição.
2. Servidor → processa.
3. Endpoint → ponto de comunicação entre os dois.

### Atividade

Nesta atividade definiremos alguns pontos de extremidade que farão a ponte entre o servidor e as aplicações-cliente.

O código do seu Program.cs deve ficar assim:

```CSharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/produtos", () => new[] { "Produto 1", "Produto 2", "Produto 3" });
app.MapGet("/clientes", () => new[] { "Cliente 1", "Cliente 2", "Cliente 3" });
app.MapGet("/vendedores", () => new[] { "Vendedor 1", "Vendedor 2", "Vendedor 3" });

await app.RunAsync();
Console.WriteLine("Fim da Aplicação");
```

Reinicie a aplicação e teste as novas APIs:

http://localhost:5000/produtos

http://localhost:5000/clientes

http://localhost:5000/vendedores

Considerações finais

Para limpar ops arquivos da última compilação use o comando:

```CSharp
dotnet clean
```


Para compilar a aplicação sem rodar use o comando:

```CSharp
dotnet build
```

Para publicar a aplicação para usuários finais use o comando:

```CSharp
dotnet publish -c Release
```

E para compilar a aplicação para rodar num computador (Windows de 64bits) sem o .NET Runtime instalado, use o comando:

```CSharp
dotnet publish -c Release -r win-x64 --self-contained true
```

### Depuração

Para depurar o projeto e verificar possíveis erros, crie pontos de interrupção clicando na frente do número das linhas do VS Code, em seguida, pressione F5.

Na primeira vez podem ser solicitadas algumas permissões. O código será executado até cada parada. Ao final o navegador será aberto e a interface do cliente da aplicação, exibida.

Verifique na guia Saída do terminal se a string “Fim da Aplicação” foi impressa.

---

# Dia 2
