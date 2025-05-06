using AstroVista.Core.Models;

namespace AstroVista.Application.Nasa.Responses;

public record SearchImagesResponse(NasaImageSearchResult? SearchResult);