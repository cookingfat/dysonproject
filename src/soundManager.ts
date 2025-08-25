export type SfxType = 'click' | 'buy' | 'level-up' | 'orerush' | 'overcharge' | 'efficiency' | 'research';

class SoundManager {
    private musicPlayer: HTMLAudioElement | null = null;
    private sfxPlayers: HTMLAudioElement[] = [];
    private playlist: string[] = [];
    private currentTrackIndex = -1;

    private masterVolume = 0.8;
    private musicVolume = 0.3;
    private sfxVolume = 0.7;
    
    private isMusicPlaying = false;

    constructor() {
        for (let i = 1; i <= 7; i++) {
            this.playlist.push(`/assets/sound/music${i}.mp3`);
        }
        this.shufflePlaylist();
    }

    private shufflePlaylist() {
        // Fisher-Yates shuffle
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
        this.currentTrackIndex = -1;
    }

    public playMusic() {
        if (this.isMusicPlaying) return;
        this.isMusicPlaying = true;
        // A user gesture is required to start audio. We'll attempt to play,
        // and if it fails, the first click in the game should re-trigger it.
        this.playNextTrack();
    }

    private playNextTrack = () => {
        if (this.musicPlayer) {
            this.musicPlayer.removeEventListener('ended', this.playNextTrack);
            this.musicPlayer.pause();
        }
        
        this.currentTrackIndex++;
        if (this.currentTrackIndex >= this.playlist.length) {
            this.shufflePlaylist();
            this.currentTrackIndex = 0;
        }

        const trackUrl = this.playlist[this.currentTrackIndex];
        this.musicPlayer = new Audio(trackUrl);
        this.musicPlayer.volume = this.masterVolume * this.musicVolume;
        this.musicPlayer.addEventListener('ended', this.playNextTrack);
        
        this.musicPlayer.play().catch(error => {
            console.warn("Music playback failed. A user interaction is likely required.", error);
            this.isMusicPlaying = false;
        });
    }

    public playSoundEffect(name: SfxType) {
        const sfxUrl = `/assets/sound/${name}.mp3`;
        const sfxPlayer = new Audio(sfxUrl);
        sfxPlayer.volume = this.masterVolume * this.sfxVolume;
        sfxPlayer.play().catch(e => console.error("SFX playback failed", e));
        
        this.sfxPlayers.push(sfxPlayer);
        sfxPlayer.addEventListener('ended', () => {
            this.sfxPlayers = this.sfxPlayers.filter(p => p !== sfxPlayer);
        });
    }

    public setMasterVolume(volume: number) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.musicPlayer) {
            this.musicPlayer.volume = this.masterVolume * this.musicVolume;
        }
    }

    public setMusicVolume(volume: number) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicPlayer) {
            this.musicPlayer.volume = this.masterVolume * this.musicVolume;
        }
    }

    public setSfxVolume(volume: number) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
}

export const soundManager = new SoundManager();
