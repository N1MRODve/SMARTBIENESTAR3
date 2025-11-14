import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export function useDemoRoutes() {
  const router = useRouter();
  const route = useRoute();

  const isDemo = computed(() => {
    return route.path.startsWith('/demo');
  });

  const getRoutePath = (adminPath) => {
    if (isDemo.value) {
      return adminPath.replace('/admin/', '/demo/');
    }
    return adminPath;
  };

  const navigateTo = (adminPath) => {
    const path = getRoutePath(adminPath);
    router.push(path);
  };

  return {
    isDemo,
    getRoutePath,
    navigateTo
  };
}
