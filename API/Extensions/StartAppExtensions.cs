namespace API.Extensions
{
    public static class StartAppExtensions
    {
        public static void StartApp(this WebApplicationBuilder builder)
        {
            var app = builder.Build();

            app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseHttpsRedirection();
            app.MapControllers();
            app.Run();
        }
    }
}
