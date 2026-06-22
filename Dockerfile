# Use official ASP.NET Core runtime as base for running the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Use .NET SDK for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies (paths are relative to repo root)
COPY ["Lootora.Api/Lootora.Api.csproj", "Lootora.Api/"]
RUN dotnet restore "Lootora.Api/Lootora.Api.csproj"

# Copy all remaining source files and build
COPY Lootora.Api/ Lootora.Api/
WORKDIR "/src/Lootora.Api"
RUN dotnet build "Lootora.Api.csproj" -c Release -o /app/build

# Publish the build artifacts
FROM build AS publish
RUN dotnet publish "Lootora.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Build the final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Lootora.Api.dll"]
