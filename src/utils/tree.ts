// 动态路由
import { RouteRecordRaw } from "vue-router";
import { IMenuItem, ITreeMenuItem, IUserRouterItem } from "@/api/acl/menu/type";

 // @ts-ignore 
const modules = import.meta.glob("../views/**/**.vue");

interface ICache {
  [key: number]: ITreeMenuItem
}
/**
 * @description 转换树形结构菜单
 * @param menuList 菜单列表
 * @author JJYang 
 */
export const getTreeMenus = (menuList: IMenuItem[]): ITreeMenuItem[] => {
  const treeMenuList = [] as ITreeMenuItem[];
  // 1.新建一个空对象
  const cache: ICache = {};
  // console.log(menuList)
  menuList.forEach((treeItem) => {
    // 2.以菜单rid作为键，方便后续查找每个菜单项的父节点
    cache[treeItem.rid] = treeItem;
  });
  // console.log(cache)
  menuList.forEach((treeItem) => {
    // console.log(treeItem)
    // 3.匹配父亲，通过孩子对象中的父亲rid字段
    // （孩子对象的pid其实就是我们在添加菜单的时候已经将父亲rid赋值给pid）
    // 通过孩子的pid进行匹配父亲
    const parent = cache[treeItem.pid];
    // console.log(parent)
    // 4.如果parent为真，说明这个元素有二级孩子
    if (parent) {
      // 有二级菜单，但是没有children的添加一个children数组放二级菜单
      if (!parent.children) {
        parent.children = [] as IMenuItem[];
      }
      // 往children追加数据
      parent.children.push(treeItem);
    } else {
      // 不符合的说明是一级菜单
      treeMenuList.push(treeItem);
    }
  });
  return treeMenuList;
};


/* *
 * @description 转化动态路由
 * @param userRouters -用户路由的树形列表
 * @author JJYang
 */
export const generateRouter = (userRouters: ITreeMenuItem[]) => {
  let newRouters: RouteRecordRaw[] = userRouters.map((router: ITreeMenuItem) => {
    const isParent = router.pid === 0 && router.children;  //判断是否为一级菜单，返回Boolean
    // const fileName = router.path.match(/\/([^/]*)$/)![1];
    let routes: RouteRecordRaw = {
      path: router.path,
      name: router.name,
      meta: {
        icon: router.icon,
        title:router.title
      },
      component:
        modules[
            /* @vite-ignore */ `../views${router.path}/index.vue`
        ],
    };
    //  console.log(isParent)
    if (isParent) {
      routes.redirect = router.children![0].path as never;
      routes.component = () =>
        // main视图渲染地址
        import(/* @vite-ignore */ `@/layout/index.vue`)
    }
    if (routes && router.children) {
      routes.children = generateRouter(router.children) as never;
    }
    return routes;
  });
  return newRouters;
};

/**
 * @description 数组扁平化
 * @param target --目标数组
 * @author JJYang
 */
// export function flatter(target: any) {
//   if (Array.isArray(target)) {
//     let result: any = [];
//     target.forEach((item) => {
//       if (Array.isArray(item)) {
//         result = result.concat(flatter(item));
//       } else {
//         result.push(item);
//       }
//     });
//     return result;
//   } else {
//     return target
//   }
// };

/**
 * @description 深拷贝
 * @param target -目标值
 * @param map -缓存容器
 * @author JJYang
 */
// export const deepClone = (target: any, map: any = new Map()) => {
//   if (typeof target === 'object' && target !== null) {
//     const cache = map.get(target);
//     if (cache) {
//       return cache;
//     }
//     const isArray = Array.isArray(target);
//     let result: any = isArray ? [] : {};
//     map.set(target, result);
//     if (isArray) {
//       target.forEach((item, index) => {
//         result[index] = deepClone(item, map);
//       })
//     } else {
//       Object.keys(target).forEach(key => {
//         result[key] = deepClone(target[key], map);
//       })
//     }
//     return result;
//   } else {
//     return target
//   }
// }



