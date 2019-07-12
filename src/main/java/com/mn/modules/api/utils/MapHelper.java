package com.mn.modules.api.utils;

import java.awt.geom.Point2D;
import java.util.List;

public class MapHelper {

    /**
     * 地球半径,单位：千米
     */
    private static double EarthRadius = 6378.137;

    /**
     * 经纬度转化成弧度
     * @param d 经度/纬度
     * @return
     */
    private static double rad(double d) {
        return d * Math.PI / 180.0;
    }


    /**
     * 用haversine公式计算球面两点间的距离.
     * https://www.cnblogs.com/softfair/p/distance_of_two_latitude_and_longitude_points.html
     *
     * @param firstLatitude   第一个坐标的纬度
     * @param firstLongitude  第一个坐标的经度
     * @param secondLatitude  第二个坐标的纬度
     * @param secondLongitude 第二个坐标的经度
     * @return 返回两点之间的距离，单位：公里、千米
     */
    public static double getDistance(double firstLatitude, double firstLongitude,
                                     double secondLatitude, double secondLongitude) {
        //经纬度转换成弧度
        double firstRadLat = rad(firstLatitude);
        double firstRadLng = rad(firstLongitude);
        double secondRadLat = rad(secondLatitude);
        double secondRadLng = rad(secondLongitude);
        //差值
        double a = Math.abs(firstRadLat - secondRadLat);
        double b = Math.abs(firstRadLng - secondRadLng);
        double cal = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(firstRadLat)
                * Math.cos(secondRadLat) * Math.pow(Math.sin(b / 2), 2))) * EarthRadius;
        double result = Math.round(cal * 10000d) / 10000d;
        return result;
    }


    /**
     * 计算两个坐标点之间的距离
     *
     * @param firstPoint  第一个坐标点的（纬度,经度） 例如："31.2553210000,121.4620020000"
     * @param secondPoint 第二个坐标点的（纬度,经度） 例如："31.2005470000,121.3269970000"
     * @return 返回两点之间的距离，单位：公里/千米
     */
    public static double GetPointDistance(String firstPoint, String secondPoint) {
        String[] firstArray = firstPoint.split(",");
        String[] secondArray = secondPoint.split(",");
        double firstLatitude = Double.valueOf(firstArray[0].trim());
        double firstLongitude = Double.valueOf(firstArray[1].trim());
        double secondLatitude = Double.valueOf(secondArray[0].trim());
        double secondLongitude = Double.valueOf(secondArray[1].trim());
        return getDistance(firstLatitude, firstLongitude, secondLatitude, secondLongitude);
    }

    /**
     *
     * 这是利用:纬度间距1度=111.1km 的关系计算的；经度1度=111.1cosA
     * (A为计算经度之处的纬度，比如在北纬60度处计算经度1度的距离，就是111.1 * cos60=111.1/2km)
     *
     * @param polygons
     * @return 平方千米
     */
    private static double CalculatePolygonArea(List<LngLat> polygons)
    {
        double area = 0;
        if (polygons.size() > 2)
        {
            for (int i = 0; i < polygons.size() - 1; i++)
            {
                LngLat p1 = polygons.get(i);
                LngLat p2 = polygons.get(i+1);
                //x:经度 y:维度
                //return (p1.first-p0.first)*(p2.second-p0.second)-(p1.second-p0.second)*(p2.first-p0.first);
                area += rad(p2.getLng() - p1.getLng()) * (2 + Math.sin(rad(p1.getLat())) + Math.sin(rad(p2.getLat())));
            }
            area = area * EarthRadius * EarthRadius  / 2.0;
        }
        return Math.abs(area);
    }




}
