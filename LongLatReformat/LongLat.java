public class LongLat {
    double lon;
    double lat;

    public LongLat(){
        this.lon = 0;
        this.lat = 0;
    }

    public LongLat(double l, double la){
        this.lon = l;
        this.lat = la;
    }

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }
}
