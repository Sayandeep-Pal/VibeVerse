import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';

// Define the Song interface
interface Song {
  _id: { $oid: string };
  title: string;
  singer: string;
  image: string | null; // Allow null for potentially missing images
  songFile: string | null; // Add this field if needed
  __v: number; // Add this field if needed
  // Add other properties if they exist in your API response
}

export default function MusicPlayer({ song }: { song: Song }) {
  const { colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const DEFAULT_IMAGE_URL = 'https://api.a0.dev/assets/image?text=neon%20purple%20album%20artwork%20with%20moon%20and%20stars&aspect=1:1';
  const imageSource = song.image ? { uri: song.image } : { uri: DEFAULT_IMAGE_URL };
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Image source={imageSource} style={styles.artwork} />
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
            {song.singer}
          </Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="play-skip-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.playButton, { backgroundColor: colors.primary }]}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="play-skip-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  artist: {
    fontSize: 14,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});