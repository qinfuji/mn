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
     *
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
     * 这是利用:纬度间距1度=111.1km 的关系计算的；经度1度=111.1cosA
     * (A为计算经度之处的纬度，比如在北纬60度处计算经度1度的距离，就是111.1 * cos60=111.1/2km)
     *
     * @param polygons
     * @return 平方千米
     */
    public static double calculatePolygonArea(List<LngLat> polygons) {
        double area = 0;
        if (polygons.size() > 2) {
            for (int i = 0; i < polygons.size(); i++) {
                LngLat p1 = polygons.get(i);
                LngLat p2 = polygons.get((i + 1) % polygons.size());
                //x:经度 y:维度
                //return (p1.first-p0.first)*(p2.second-p0.second)-(p1.second-p0.second)*(p2.first-p0.first);
                area += rad(p2.getLng() - p1.getLng()) * (2 + Math.sin(rad(p1.getLat())) + Math.sin(rad(p2.getLat())));
            }
            area = area * EarthRadius * EarthRadius / 2.0;
        }
        return Math.abs(area);
    }


    /**
     * 按照多边形的投影走了，就是得到多边形，然后切割成N-2个小三角。然后计算面积
     * @param list
     * @return 平方千米
     */
    public static double calcArea(List<LngLat> list) {
        int count = list.size();
        if (count > 2) {
            //数组中的元素值
            double mtotalArea = 0;
            double LowX = 0.0;
            double LowY = 0.0;
            double MiddleX = 0.0;
            double MiddleY = 0.0;
            double HighX = 0.0;
            double HighY = 0.0;

            //三角形的边
            double AM = 0.0, BM = 0.0, CM = 0.0;
            double AL = 0.0, BL = 0.0, CL = 0.0;
            double AH = 0.0, BH = 0.0, CH = 0.0;

            double CoefficientL = 0.0, CoefficientH = 0.0;

            double ALtangent = 0.0, BLtangent = 0.0, CLtangent = 0.0;

            double AHtangent = 0.0, BHtangent = 0.0, CHtangent = 0.0;

            double ANormalLine = 0.0, BNormalLine = 0.0, CNormalLine = 0.0;

            //定位置
            double OrientationValue = 0.0;
            //余弦函数
            double AngleCos = 0.0;

            double Sum1 = 0.0, Sum2 = 0.0;
            double Count1 = 0, Count2 = 0;


            double Sum = 0.0;
            double Radius = EarthRadius;//地球半径
            for (int i = 0; i < count; i++) {
                //坐标系中，一般X代表纬度(Lon)，Y代表经度(Lat)
                if (i == 0) {
                    LowX = (list.get(count - 1).getLng()) * Math.PI / 180;
                    LowY = (list.get(count - 1).getLat()) * Math.PI / 180;
                    MiddleX = (list.get(0).getLng()) * Math.PI / 180;
                    MiddleY = (list.get(0).getLat()) * Math.PI / 180;
                    HighX = (list.get(1).getLng()) * Math.PI / 180;
                    HighY = (list.get(1).getLat()) * Math.PI / 180;
                } else if (i == count - 1) {
                    LowX = (list.get(count - 2).getLng()) * Math.PI / 180;
                    LowY = (list.get(count - 2).getLat()) * Math.PI / 180;
                    MiddleX = (list.get(count - 1).getLng()) * Math.PI / 180;
                    MiddleY = (list.get(count - 1).getLat()) * Math.PI / 180;
                    HighX = (list.get(0).getLng()) * Math.PI / 180;
                    HighY = (list.get(0).getLat()) * Math.PI / 180;
                } else {
                    LowX = (list.get(i - 1).getLng()) * Math.PI / 180;
                    LowY = (list.get(i - 1).getLat()) * Math.PI / 180;
                    MiddleX = (list.get(i).getLng()) * Math.PI / 180;
                    MiddleY = (list.get(i).getLat()) * Math.PI / 180;
                    HighX = (list.get(i + 1).getLng()) * Math.PI / 180;
                    HighY = (list.get(i + 1).getLat()) * Math.PI / 180;
                }

                AM = Math.cos(MiddleY) * Math.cos(MiddleX);
                BM = Math.cos(MiddleY) * Math.sin(MiddleX);
                CM = Math.sin(MiddleY);
                AL = Math.cos(LowY) * Math.cos(LowX);
                BL = Math.cos(LowY) * Math.sin(LowX);
                CL = Math.sin(LowY);
                AH = Math.cos(HighY) * Math.cos(HighX);
                BH = Math.cos(HighY) * Math.sin(HighX);
                CH = Math.sin(HighY);

                CoefficientL = (AM * AM + BM * BM + CM * CM) / (AM * AL + BM * BL + CM * CL);
                CoefficientH = (AM * AM + BM * BM + CM * CM) / (AM * AH + BM * BH + CM * CH);

                ALtangent = CoefficientL * AL - AM;
                BLtangent = CoefficientL * BL - BM;
                CLtangent = CoefficientL * CL - CM;
                AHtangent = CoefficientH * AH - AM;
                BHtangent = CoefficientH * BH - BM;
                CHtangent = CoefficientH * CH - CM;
                AngleCos = (AHtangent * ALtangent + BHtangent * BLtangent + CHtangent * CLtangent) / (Math.sqrt(AHtangent * AHtangent + BHtangent * BHtangent + CHtangent * CHtangent) * Math.sqrt(ALtangent * ALtangent + BLtangent * BLtangent + CLtangent * CLtangent));
                AngleCos = Math.acos(AngleCos);//余弦角度
                ANormalLine = BHtangent * CLtangent - CHtangent * BLtangent;
                BNormalLine = 0 - (AHtangent * CLtangent - CHtangent * ALtangent);
                CNormalLine = AHtangent * BLtangent - BHtangent * ALtangent;

                if (AM != 0) {
                    OrientationValue = ANormalLine / AM;
                } else if (BM != 0) {
                    OrientationValue = BNormalLine / BM;
                } else {
                    OrientationValue = CNormalLine / CM;
                }
                if (OrientationValue > 0) {
                    Sum1 += AngleCos;
                    Count1++;
                } else {
                    Sum2 += AngleCos;
                    Count2++;
                }
            }
            if (Sum1 > Sum2) {
                Sum = Sum1 + (2 * Math.PI * Count2 - Sum2);
            } else {
                Sum = (2 * Math.PI * Count1 - Sum1) + Sum2;
            }
            return Math.abs((Sum - (count - 2) * Math.PI) * Radius * Radius);
        }
        return 0;
    }
}
