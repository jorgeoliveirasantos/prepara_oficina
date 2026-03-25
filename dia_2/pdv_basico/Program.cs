var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/produtos", () => new[] { "Produto 1", "Produto 2", "Produto 3" });
app.MapGet("/clientes", () => new[] { "Cliente 1", "Cliente 2", "Cliente 3" });
app.MapGet("/vendedores", () => new[] { "Vendedor 1", "Vendedor 2", "Vendedor 3" });

await app.RunAsync();
Console.WriteLine("Fim da Aplicação");