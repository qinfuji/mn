package com.mn.modules.api.utils.melkman;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Polygon {
    private List<Point> pointList;
}
