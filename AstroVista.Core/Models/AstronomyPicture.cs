namespace AstroVista.Core.Models;

public class AstronomyPicture
{
    public string Title { get; private set; }
    public string Explanation { get; private set; }
    public string Url { get; private set; }
    public MediaType MediaType { get; private set; }
    public DateTime Date { get; private set; }
    public string? Copyright { get; private set; }
    public string? HdUrl { get; private set; }
    public string? ThumbnailUrl { get; private set; }
    
    public AstronomyPicture(
        string title,
        string explanation,
        string url,
        MediaType mediaType,
        DateTime date,
        string? copyright = null,
        string? hdUrl = null,
        string? thumbnailUrl = null)
    {
        Title = title;
        Explanation = explanation;
        Url = url;
        MediaType = mediaType;
        Date = date;
        Copyright = copyright;
        HdUrl = hdUrl;
        ThumbnailUrl = thumbnailUrl;
    }
    
    public bool IsVideo => MediaType == MediaType.Video;
    public bool HasHighResolution => !string.IsNullOrEmpty(HdUrl);
    public string GetBestQualityUrl() => HasHighResolution ? HdUrl! : Url;
}