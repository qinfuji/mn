import request from '../utils/request';

import config from '@config';

var HOST = config.HOST;

let categroyLabels = [];

export async function fatch(parentId) {
  if (parentId) {
    return request(`${HOST}/api/categroylabels/query?parentId=${parentId}`, {
      method: 'GET',
    });
  } else {
    return request(`${HOST}/api/categroylabels/query`, {
      method: 'GET',
    });
  }
}

export async function create(params) {
  return request(`${HOST}/api/categroylabels/createOrUpdate`, {
    method: 'POST',
    body: params,
  });
}

export async function invalid(params) {
  return request(`${HOST}/api/categroylabels/${params.id}/state`, {
    method: 'PUT',
  });
}

export async function queryRootByLabel(label) {
  return request(`${HOST}/api/categroylabels/queryRootByLabel?rootLabel=${label}`, {
    method: 'GET',
  });
}

export async function fatchAll() {
  if (categroyLabels && categroyLabels.length) {
    return categroyLabels;
  }
  const response = await request(`${HOST}/api/categroylabels/queryAll`, {
    method: 'GET',
  });
  if (response) {
    const allcategroyLabels = response.data || [];
    //首先获取根节点数据
    const idMap = {};
    const root = [];
    allcategroyLabels.forEach((categroy) => {
      const t = {
        id: categroy.id,
        key: categroy.id,
        value: categroy.id,
        title: categroy.label,
        parentId: categroy.parentId,
        isLeaf: true,
      };
      idMap[categroy.id] = t;
      if (categroy.parentId == null) {
        root.push(t);
      }
    });

    Object.keys(idMap).forEach((id) => {
      const categroy = idMap[id];
      if (!categroy) return;

      if (categroy.parentId != null) {
        const parent = idMap[categroy.parentId];
        if (parent) {
          parent.isLeaf = false;
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(categroy);
        }
      }
    });
    categroyLabels = categroyLabels.concat(root);
  }
  return categroyLabels;
}
