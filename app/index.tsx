import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import MusicPlayer from '../components/MusicPlayer';
import { Audio } from 'expo-av';  // Import Audio from expo-av

const API_URL = 'https://vibe-verse-be.vercel.app/api/songs';
const DEFAULT_IMAGE_URL = 'https://api.a0.dev/assets/image?text=neon%20purple%20album%20artwork%20with%20moon%20and%20stars&aspect=1:1';

interface Song {
  _id: { $oid: string };
  title: string;
  singer: string;
  image: string | null;
  songFile: string | null;
  __v: number;
}

export default function HomeScreen() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { isDark, colors } = useTheme();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const sound = useRef<Audio.Sound | null>(null); // Ref to hold the sound object

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setSongs(data as Song[]);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {  // Load and Unload the sound object when currentSong changes
    const loadSound = async () => {
      if (currentSong?.songFile) {  // Ensure currentSong exists and has a songFile
        try {
          const { sound: newSound } = await Audio.Sound.createAsync({ uri: currentSong.songFile });
          sound.current = newSound;

          await newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          });
        } catch (error) {
          console.error("Error loading sound", error);
        }
      }
    };

    loadSound();

    return () => {
      if (sound.current) {
        sound.current.unloadAsync(); // Unload the sound when the component unmounts or the song changes
      }
    };

  }, [currentSong]);  // Effect runs when currentSong changes

  const playPauseSound = async () => {
    if (sound.current) {
      if (isPlaying) {
        await sound.current.pauseAsync();
      } else {
        await sound.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      console.log('Sound not loaded yet');
    }
  };

  const renderSongCard = (song: Song) => {
    const imageSource = song.image ? { uri: song.image } : { uri: DEFAULT_IMAGE_URL };
    return (
      <TouchableOpacity
        key={song._id.$oid}
        style={[styles.songCard, { backgroundColor: colors.card }]}
        onPress={() => {
          setCurrentSong(song);
          setIsPlaying(false); // Reset playing state
        }}
      >
        <Image
          source={imageSource}
          style={styles.songArtwork}
        />
        <View style={styles.songInfo}>
          <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={[styles.songArtist, { color: colors.textSecondary }]} numberOfLines={1}>
            {song.singer}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const categories = ['All', 'Pop', 'Rock'];
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Discover Music</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && { backgroundColor: colors.primary },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && { color: 'white' },
                { color: category === selectedCategory ? 'white' : colors.text }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.songsGrid}>
          {songs.map(renderSongCard)}
        </View>
      </ScrollView>

      {currentSong && (
        <View style={styles.musicPlayerContainer}>
          <TouchableOpacity onPress={playPauseSound}>
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={48}
              color={colors.primary}
            />
          </TouchableOpacity>
          <Text style={[styles.nowPlayingText, { color: colors.text }]}>
            {currentSong.title} - {currentSong.singer}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  songsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  songCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  songArtwork: {
    width: '100%',
    height: 170,
  },
  songInfo: {
    padding: 12,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
  },
  musicPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  nowPlayingText: {
    fontSize: 16,
  },
});