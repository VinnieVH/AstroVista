namespace AstroVista.API.Endpoints.Common
{
    public static class EndpointHelpers
    {
        public static RouteGroupBuilder MapApiGroup(
            this IEndpointRouteBuilder builder,
            string prefix,
            string tag)
        {
            var group = builder.MapGroup(prefix);
            
            group.WithOpenApi();
            
            group.WithTags(tag); 
            
            return group;
        }
    }
}