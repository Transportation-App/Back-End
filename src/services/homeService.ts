import { DataSnapshot } from "firebase/database";
import ConfigureApp from "../config/config";

const { fbConnector } = ConfigureApp;

export class HomeService {
  public static getStations(): Promise<{ from: string; to: string }[]> {
    return new Promise((resolve, reject) => {
      fbConnector.read(
        "Itinerary Service",
        "",
        (snapshot: DataSnapshot) => {
          if (snapshot.exists()) {
            const itineraries = snapshot.val();
            const stations = itineraries.map((itinerary: any) =>
              itinerary.stations.map((station: any) => ({
                from: station.from,
                to: station.to,
              }))
            ).flat();
            
            console.log("Stations resolved:", stations); // Log the stations data for debugging
            resolve(stations);
          } else {
            resolve([]); // Return an empty array if no data exists
          }
        },
        (error: any) => {
          console.error("Firebase read error:", error); // Log any Firebase read errors
          reject(error);
        }
      );
    });
  }
};





