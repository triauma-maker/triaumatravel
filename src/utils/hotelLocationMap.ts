export interface HotelLocationMapData {
  title: string;
  location?: string;
  airportDriveTime?: string;
  nearbyHighlights?: string;
}

export function getHotelMapUrls(hotel: HotelLocationMapData) {
  const destination = [hotel.title, hotel.location].filter(Boolean).join(", ");
  const mapParams = new URLSearchParams({
    q: destination,
    output: "embed",
  });
  const directionsParams = new URLSearchParams({
    api: "1",
    origin: "Ngurah Rai International Airport (DPS)",
    destination,
    travelmode: "driving",
  });

  return {
    embedUrl: `https://maps.google.com/maps?${mapParams.toString()}`,
    directionsUrl: `https://www.google.com/maps/dir/?${directionsParams.toString()}`,
  };
}

export function hydrateHotelLocationMap(
  container: HTMLElement,
  hotel: HotelLocationMapData,
) {
  const address = container.querySelector<HTMLElement>(".hotel-location-address");
  const iframe = container.querySelector<HTMLIFrameElement>(".hotel-location-iframe");
  const directionsLink = container.querySelector<HTMLAnchorElement>(".hotel-directions-link");
  const airportInfo = container.querySelector<HTMLElement>(".hotel-airport-info");
  const highlightsInfo = container.querySelector<HTMLElement>(".hotel-highlights-info");
  const { embedUrl, directionsUrl } = getHotelMapUrls(hotel);

  if (address) {
    address.textContent = hotel.location || hotel.title;
  }
  if (iframe) {
    iframe.src = embedUrl;
    iframe.title = `Map showing ${hotel.title}`;
  }
  if (directionsLink) {
    directionsLink.href = directionsUrl;
  }
  if (airportInfo) {
    airportInfo.textContent = hotel.airportDriveTime
      ? `Approx. ${hotel.airportDriveTime} drive from Ngurah Rai International Airport (DPS)`
      : "View the route and estimated driving time from Ngurah Rai International Airport (DPS)";
  }
  if (highlightsInfo) {
    highlightsInfo.textContent = hotel.nearbyHighlights || "";
    highlightsInfo.hidden = !hotel.nearbyHighlights;
  }
}
