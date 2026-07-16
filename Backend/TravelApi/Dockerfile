# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# copy csproj và restore trước (tối ưu build)
COPY *.csproj ./
RUN dotnet restore

# copy toàn bộ source
COPY . ./
RUN dotnet publish -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# expose port
EXPOSE 10000

# run app
ENTRYPOINT ["dotnet", "TravelApi.dll"]