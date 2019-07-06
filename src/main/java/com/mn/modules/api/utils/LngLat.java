package com.mn.modules.api.utils;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Data
@ToString
@RequiredArgsConstructor()
public class LngLat {


    public LngLat(Double lng, Double lat) {
        this.lat = lat;
        this.lng = lng;
    }

    /**
     * 经度坐标
     */
    private Double lng;
    /**
     * 维度坐标
     */
    private Double lat;
    /**
     * 与P0点的角度
     */
    private double arCos;


    @Override
    public int hashCode() {
        long bits = java.lang.Double.doubleToLongBits(getLng());
        bits ^= java.lang.Double.doubleToLongBits(getLat()) * 31;
        return (((int) bits) ^ ((int) (bits >> 32)));
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof LngLat) {
            LngLat p2d = (LngLat) obj;
            return (getLng().equals(p2d.getLng())) && (getLat().equals(p2d.getLat()));
        }
        return super.equals(obj);
    }
}
