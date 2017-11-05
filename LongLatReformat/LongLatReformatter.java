import java.util.*;
import java.io.*;

public class LongLatReformatter {
    public static void main(String [ ] args) {

        Scanner stdin = new Scanner(new BufferedInputStream(System.in));

        ArrayList<LongLat> points = new ArrayList<>();
        String[] rip;
        String temp = "";
        double tempLon=0;
        double tempLat=0;

        String finalFormat = "";

        System.out.println("Copy and paste the long/lat points. Press 'X' to quit");
        temp = stdin.nextLine();
        while (temp!=null && !temp.equals("X")){
            rip = (temp.split(","));
            tempLon = Double.parseDouble(rip[0]);
            tempLat = Double.parseDouble(rip[1]);

            points.add(new LongLat(tempLon, tempLat));
            temp = stdin.nextLine().toUpperCase();
        }

        System.out.println("New Format: \n");
        for (int i=0;i<points.size();i++){
            if (i==0){
                finalFormat = finalFormat + "=[ \n";
            }
            if (i==(points.size()-1)){
                finalFormat = finalFormat + ("{\"lat\": "+points.get(i).getLon()+", \"lng\": "+points.get(i).getLat()+"}]; \n");
            }
            else {
                finalFormat = finalFormat + ("{\"lat\": "+points.get(i).getLon()+", \"lng\": "+points.get(i).getLat()+"}, \n");
            }
        }

        System.out.println(finalFormat);
    }
}
