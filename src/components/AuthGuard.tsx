import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('[AuthGuard] user:', user?.email, '| pathname:', pathname, '| isLoading:', isLoading);
  
    if (isLoading) return;
  
    if (!user && pathname !== '/login') {
      console.log('[AuthGuard] No user → redirecting to /login');
      router.replace('/login');
    }
  
    if (user && pathname === '/login') {
      console.log('[AuthGuard] Logged in → redirecting to /(tabs)');
      router.replace('/(tabs)');
    }
  }, [user, isLoading, pathname]);
    if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});
