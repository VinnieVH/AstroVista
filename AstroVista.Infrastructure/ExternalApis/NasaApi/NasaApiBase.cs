using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;

namespace AstroVista.Infrastructure.ExternalApis.NasaApi;

public abstract class NasaApiBase
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    
    protected NasaApiBase(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://api.nasa.gov/");
        _apiKey = configuration["Nasa:ApiKey"] ?? "DEMO_KEY";
    }
    
    protected async Task<T?> GetAsync<T>(string endpoint, Dictionary<string, string>? parameters = null)
    {
        parameters ??= new Dictionary<string, string>();
        parameters["api_key"] = _apiKey;
        
        var queryString = string.Join("&", parameters.Select(p => $"{p.Key}={Uri.EscapeDataString(p.Value)}"));
        var fullUrl = $"{endpoint}?{queryString}";
        
        var response = await _httpClient.GetAsync(fullUrl);
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<T>();
    }
}