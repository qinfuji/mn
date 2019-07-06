package com.mn.modules.api.utils;

import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.List;

/**
 * 判断一个点是否在一个多边形内
 * 提供了三种计算方式，孰好孰坏在实践中比较一下
 *
 * @author xiongshiyan at 2019/1/11 , contact me with email yanshixiong@126.com or phone 15208384257
 */
public class GeometryUtil {
    private static final int POLYGON_MIN_SIZE = 3;


    /**
     * 没有测试
     *
     * @param pointX
     * @param pointY
     * @param MapUnits
     * @return
     */
    public static double calcArea(ArrayList pointX, ArrayList pointY, String MapUnits) {

        int Count = pointX.size();
        if (Count > 2) {
            double mtotalArea = 0;
            if (MapUnits == "DEGREES")//经纬度坐标下的球面多边形
            {
                double LowX = 0.0;
                double LowY = 0.0;
                double MiddleX = 0.0;
                double MiddleY = 0.0;
                double HighX = 0.0;
                double HighY = 0.0;

                double AM = 0.0;
                double BM = 0.0;
                double CM = 0.0;

                double AL = 0.0;
                double BL = 0.0;
                double CL = 0.0;

                double AH = 0.0;
                double BH = 0.0;
                double CH = 0.0;

                double CoefficientL = 0.0;
                double CoefficientH = 0.0;

                double ALtangent = 0.0;
                double BLtangent = 0.0;
                double CLtangent = 0.0;

                double AHtangent = 0.0;
                double BHtangent = 0.0;
                double CHtangent = 0.0;

                double ANormalLine = 0.0;
                double BNormalLine = 0.0;
                double CNormalLine = 0.0;

                double OrientationValue = 0.0;

                double AngleCos = 0.0;

                double Sum1 = 0.0;
                double Sum2 = 0.0;
                double Count2 = 0;
                double Count1 = 0;


                double Sum = 0.0;
                double Radius = 6378000;

                for (int i = 0; i < Count; i++) {
                    if (i == 0) {
                        LowX = (double) pointX.get(Count - 1) * Math.PI / 180;
                        LowY = (double) pointY.get(Count - 1) * Math.PI / 180;
                        MiddleX = (double) pointX.get(0) * Math.PI / 180;
                        MiddleY = (double) pointY.get(0) * Math.PI / 180;
                        HighX = (double) pointX.get(1) * Math.PI / 180;
                        HighY = (double) pointY.get(1) * Math.PI / 180;
                    } else if (i == Count - 1) {
                        LowX = (double) pointX.get(Count - 2) * Math.PI / 180;
                        LowY = (double) pointY.get(Count - 2) * Math.PI / 180;
                        MiddleX = (double) pointX.get(Count - 1) * Math.PI / 180;
                        MiddleY = (double) pointY.get(Count - 1) * Math.PI / 180;
                        HighX = (double) pointX.get(0) * Math.PI / 180;
                        HighY = (double) pointY.get(0) * Math.PI / 180;
                    } else {
                        LowX = (double) pointX.get(i - 1) * Math.PI / 180;
                        LowY = (double) pointY.get(i - 1) * Math.PI / 180;
                        MiddleX = (double) pointX.get(i) * Math.PI / 180;
                        MiddleY = (double) pointY.get(i) * Math.PI / 180;
                        HighX = (double) pointX.get(i + 1) * Math.PI / 180;
                        HighY = (double) pointY.get(i + 1) * Math.PI / 180;
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

                    AngleCos = Math.acos(AngleCos);

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
                        //Sum +=2*Math.PI-AngleCos;
                    }

                }

                if (Sum1 > Sum2) {
                    Sum = Sum1 + (2 * Math.PI * Count2 - Sum2);
                } else {
                    Sum = (2 * Math.PI * Count1 - Sum1) + Sum2;
                }

                //平方米
                mtotalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius;
            } else { //非经纬度坐标下的平面多边形

                int i, j;
                //double j;
                double p1x, p1y;
                double p2x, p2y;
                for (i = Count - 1, j = 0; j < Count; i = j, j++) {

                    p1x = (double) pointX.get(i);
                    p1y = (double) pointY.get(i);

                    p2x = (double) pointX.get(j);
                    p2y = (double) pointY.get(j);

                    mtotalArea += p1x * p2y - p2x * p1y;
                }
                mtotalArea /= 2.0;
            }
            return mtotalArea;
        }
        return 0;
    }

    /**
     * @param point
     * @param polygon 多边形的顶点
     * @return
     */
    public static boolean isPtInPolygon(LngLat point, List<LngLat> polygon) {
        assertParams(point, polygon);

        int iSum, iIndex;
        double dLon1, dLon2, dLat1, dLat2, dLon;
        int size = polygon.size();
        iSum = 0;
        for (iIndex = 0; iIndex < size; iIndex++) {
            if (iIndex == size - 1) {
                dLon1 = polygon.get(iIndex).getLng();
                dLat1 = polygon.get(iIndex).getLat();
                dLon2 = polygon.get(0).getLng();
                dLat2 = polygon.get(0).getLat();
            } else {
                dLon1 = polygon.get(iIndex).getLng();
                dLat1 = polygon.get(iIndex).getLat();
                dLon2 = polygon.get(iIndex + 1).getLng();
                dLat2 = polygon.get(iIndex + 1).getLat();
            }
            // 以下语句判断A点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上
            Double pointLng = point.getLng();
            Double pointLat = point.getLng();

            if (((pointLat >= dLat1) && (pointLat < dLat2))
                    || ((pointLat >= dLat2) && (pointLat < dLat1))) {
                if (Math.abs(dLat1 - dLat2) > 0) {
                    //得到 A点向左射线与边的交点的x坐标：
                    dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - pointLat)) / (dLat1 - dLat2);
                    // 如果交点在A点左侧（说明是做射线与 边的交点），则射线与边的全部交点数加一：
                    if (dLon < pointLng) {
                        iSum++;
                    }
                }
            }
        }
        return (iSum % 2) != 0;
    }

    /**
     * @param point   检测点
     * @param polygon 多边形的顶点
     *                返回一个点是否在一个多边形区域内， 如果点位于多边形的顶点或边上，不算做点在多边形内，返回false
     */
    public static boolean isPointInPoly(LngLat point, List<LngLat> polygon) {
        assertParams(point, polygon);

        java.awt.geom.GeneralPath p = new java.awt.geom.GeneralPath();
        LngLat first = polygon.get(0);
        p.moveTo(first.getLng(), first.getLat());
        int size = polygon.size();
        for (int i = 1; i < size; i++) {
            LngLat pa = polygon.get(i);
            p.lineTo(pa.getLng(), pa.getLat());
        }
        p.lineTo(first.getLng(), first.getLat());
        p.closePath();
        return p.contains(point.getLng(), point.getLat());
    }

    /**
     * 判断点是否在多边形内，如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
     *
     * @param point   检测点
     * @param polygon 多边形的顶点
     * @return 点在多边形内返回true, 否则返回false
     */
    public static boolean isPtInPoly(LngLat point, List<LngLat> polygon) {
        assertParams(point, polygon);

        int N = polygon.size();
        //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
        boolean boundOrVertex = true;
        //cross points count of x
        int intersectCount = 0;
        //浮点类型计算时候与0比较时候的容差
        double precision = 2e-10;
        //neighbour bound vertices
        LngLat p1, p2;
        //当前点
        LngLat p = point;

        //left vertex
        p1 = polygon.get(0);
        //check all rays
        for (int i = 1; i <= N; ++i) {
            if (p.equals(p1)) {
                //p is an vertex
                // TODO
                return boundOrVertex;
            }
            //right vertex
            p2 = polygon.get(i % N);
            //ray is outside of our interests
            if (p.getLng() < Math.min(p1.getLng(), p2.getLng()) || p.getLng() > Math.max(p1.getLng(), p2.getLng())) {
                p1 = p2;
                //next ray left point
                continue;
            }

            //ray is crossing over by the algorithm (common part of)
            if (p.getLng() > Math.min(p1.getLng(), p2.getLng()) && p.getLng() < Math.max(p1.getLng(), p2.getLng())) {
                //x is before of ray
                if (p.getLat() <= Math.max(p1.getLat(), p2.getLat())) {
                    //overlies on a horizontal ray
                    if (p1.getLng().equals(p2.getLng()) && p.getLat() >= Math.min(p1.getLat(), p2.getLat())) {
                        return boundOrVertex;
                    }

                    //ray is vertical
                    if (p1.getLat().equals(p2.getLat())) {
                        //overlies on a vertical ray
                        if (p1.getLat().equals(p.getLat())) {
                            return boundOrVertex;
                            //before ray
                        } else {
                            ++intersectCount;
                        }
                        //cross point on the left side
                    } else {
                        //cross point of y
                        double xinters = (p.getLng() - p1.getLng()) * (p2.getLat() - p1.getLat()) / (p2.getLng() - p1.getLng()) + p1.getLat();
                        //overlies on a ray
                        if (Math.abs(p.getLat() - xinters) < precision) {
                            return boundOrVertex;
                        }
                        //before ray
                        if (p.getLat() < xinters) {
                            ++intersectCount;
                        }
                    }
                }
                //special case when ray is crossing through the vertex
            } else {
                //p crossing over p2
                if (p.getLng().equals(p2.getLng()) && p.getLat() <= p2.getLat()) {
                    //next vertex
                    LngLat p3 = polygon.get((i + 1) % N);
                    //p.x lies between p1.x & p3.x
                    if (p.getLng() >= Math.min(p1.getLng(), p3.getLng()) && p.getLng() <= Math.max(p1.getLng(), p3.getLng())) {
                        ++intersectCount;
                    } else {
                        intersectCount += 2;
                    }
                }
            }
            //next ray left point
            p1 = p2;
        }

        //偶数在多边形外
        if (intersectCount % 2 == 0) {
            return false;
            //奇数在多边形内
        } else {
            return true;
        }
    }

    private static void assertParams(LngLat point, List<LngLat> polygon) {
        if (null == point || null == polygon || polygon.size() < POLYGON_MIN_SIZE) {
            throw new IllegalArgumentException("参数不能为空，且多边形点数大于3");
        }
    }

}