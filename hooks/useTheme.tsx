import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    primary: '#FF3B30',
    background: isDark ? '#000000' : '#FFFFFF',
    card: isDark ? '#1C1C1E' : '#F2F2F7',
    text: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#EBEBF5' : '#3C3C43',
    border: isDark ? '#38383A' : '#C6C6C8',
  };

  return { isDark, colors };
};