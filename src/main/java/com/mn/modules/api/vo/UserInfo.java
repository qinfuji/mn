package com.mn.modules.api.vo;

import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@ToString
public class UserInfo {

    String id;

    String userName;

    String organizationId;

    List<String> permissions;
}
