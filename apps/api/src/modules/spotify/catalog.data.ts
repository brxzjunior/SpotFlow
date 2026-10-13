import { SpotifyTrack } from '@spotflow/shared';

export interface GenreCatalog {
  genre: string;
  keywords: string[];
  tracks: SpotifyTrack[];
}

export const RICH_GENRE_CATALOG: GenreCatalog[] = [
  {
    genre: 'synthwave',
    keywords: ['synthwave', 'retrowave', 'chillwave', 'cyberpunk', 'neon', '80s synth', 'outrun', 'programar', 'coding'],
    tracks: [
      {
        id: 'synth-1',
        name: 'Daylight',
        artists: [{ id: 'art-tycho', name: 'Tycho' }],
        album: { id: 'alb-dive', name: 'Dive', images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop' }] },
        durationMs: 222000,
        explicit: false,
        popularity: 72,
        uri: 'spotify:track:1TychoDaylightXxx01',
        externalUrl: 'https://open.spotify.com/track/1TychoDaylightXxx01'
      },
      {
        id: 'synth-2',
        name: 'Nightcall',
        artists: [{ id: 'art-kavinsky', name: 'Kavinsky' }],
        album: { id: 'alb-outrun', name: 'OutRun', images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop' }] },
        durationMs: 259000,
        explicit: false,
        popularity: 85,
        uri: 'spotify:track:2KavinskyNightcallXxx02',
        externalUrl: 'https://open.spotify.com/track/2KavinskyNightcallXxx02'
      },
      {
        id: 'synth-3',
        name: 'Resonance',
        artists: [{ id: 'art-home', name: 'HOME' }],
        album: { id: 'alb-odyssey', name: 'Odyssey', images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' }] },
        durationMs: 212000,
        explicit: false,
        popularity: 80,
        uri: 'spotify:track:3HOMEResonanceXxx03',
        externalUrl: 'https://open.spotify.com/track/3HOMEResonanceXxx03'
      },
      {
        id: 'synth-4',
        name: 'Sunset',
        artists: [{ id: 'art-themidnight', name: 'The Midnight' }],
        album: { id: 'alb-endlesssummer', name: 'Endless Summer', images: [{ url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&h=300&fit=crop' }] },
        durationMs: 326000,
        explicit: false,
        popularity: 76,
        uri: 'spotify:track:4TheMidnightSunset04',
        externalUrl: 'https://open.spotify.com/track/4TheMidnightSunset04'
      },
      {
        id: 'synth-5',
        name: 'Tech Noir',
        artists: [{ id: 'art-gunship', name: 'Gunship' }],
        album: { id: 'alb-gunship', name: 'GUNSHIP', images: [{ url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop' }] },
        durationMs: 297000,
        explicit: false,
        popularity: 70,
        uri: 'spotify:track:5GunshipTechNoir05',
        externalUrl: 'https://open.spotify.com/track/5GunshipTechNoir05'
      },
      {
        id: 'synth-6',
        name: 'Running in the Night',
        artists: [{ id: 'art-fm84', name: 'FM-84' }, { id: 'art-olliewride', name: 'Ollie Wride' }],
        album: { id: 'alb-atlas', name: 'Atlas', images: [{ url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&h=300&fit=crop' }] },
        durationMs: 270000,
        explicit: false,
        popularity: 74,
        uri: 'spotify:track:6FM84RunningNight06',
        externalUrl: 'https://open.spotify.com/track/6FM84RunningNight06'
      }
    ]
  },
  {
    genre: 'rock',
    keywords: ['rock', 'indie', 'metal', 'guitarra', 'clássico', 'banda', 'anos 90', 'anos 80', 'anos 2000'],
    tracks: [
      {
        id: 'rock-1',
        name: 'Bohemian Rhapsody',
        artists: [{ id: 'art-queen', name: 'Queen' }],
        album: { id: 'alb-nightopera', name: 'A Night at the Opera', images: [{ url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop' }] },
        durationMs: 354000,
        explicit: false,
        popularity: 91,
        uri: 'spotify:track:1QueenBohemian01',
        externalUrl: 'https://open.spotify.com/track/1QueenBohemian01'
      },
      {
        id: 'rock-2',
        name: 'Smells Like Teen Spirit',
        artists: [{ id: 'art-nirvana', name: 'Nirvana' }],
        album: { id: 'alb-nevermind', name: 'Nevermind', images: [{ url: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=300&h=300&fit=crop' }] },
        durationMs: 301000,
        explicit: false,
        popularity: 89,
        uri: 'spotify:track:2NirvanaSmells02',
        externalUrl: 'https://open.spotify.com/track/2NirvanaSmells02'
      },
      {
        id: 'rock-3',
        name: 'Do I Wanna Know?',
        artists: [{ id: 'art-arctic', name: 'Arctic Monkeys' }],
        album: { id: 'alb-am', name: 'AM', images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' }] },
        durationMs: 272000,
        explicit: false,
        popularity: 90,
        uri: 'spotify:track:3ArcticDoIWanna03',
        externalUrl: 'https://open.spotify.com/track/3ArcticDoIWanna03'
      },
      {
        id: 'rock-4',
        name: 'In the End',
        artists: [{ id: 'art-linkin', name: 'Linkin Park' }],
        album: { id: 'alb-hybrid', name: 'Hybrid Theory', images: [{ url: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=300&h=300&fit=crop' }] },
        durationMs: 216000,
        explicit: false,
        popularity: 88,
        uri: 'spotify:track:4LinkinInTheEnd04',
        externalUrl: 'https://open.spotify.com/track/4LinkinInTheEnd04'
      },
      {
        id: 'rock-5',
        name: 'Californication',
        artists: [{ id: 'art-rhcp', name: 'Red Hot Chili Peppers' }],
        album: { id: 'alb-californication', name: 'Californication', images: [{ url: 'https://images.unsplash.com/photo-1445985543469-433ecba6244f?w=300&h=300&fit=crop' }] },
        durationMs: 329000,
        explicit: false,
        popularity: 87,
        uri: 'spotify:track:5RHCPCalifornication05',
        externalUrl: 'https://open.spotify.com/track/5RHCPCalifornication05'
      },
      {
        id: 'rock-6',
        name: 'Mr. Brightside',
        artists: [{ id: 'art-killers', name: 'The Killers' }],
        album: { id: 'alb-hotfuss', name: 'Hot Fuss', images: [{ url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop' }] },
        durationMs: 222000,
        explicit: false,
        popularity: 86,
        uri: 'spotify:track:6KillersBrightside06',
        externalUrl: 'https://open.spotify.com/track/6KillersBrightside06'
      }
    ]
  },
  {
    genre: 'hiphop',
    keywords: ['hip-hop', 'hip hop', 'rap', 'trap', 'treino', 'gym', 'musculação', 'batida', 'flow'],
    tracks: [
      {
        id: 'hiphop-1',
        name: 'Till I Collapse',
        artists: [{ id: 'art-eminem', name: 'Eminem' }, { id: 'art-natedogg', name: 'Nate Dogg' }],
        album: { id: 'alb-eminemshow', name: 'The Eminem Show', images: [{ url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&h=300&fit=crop' }] },
        durationMs: 297000,
        explicit: true,
        popularity: 89,
        uri: 'spotify:track:1EminemTillICollapse01',
        externalUrl: 'https://open.spotify.com/track/1EminemTillICollapse01'
      },
      {
        id: 'hiphop-2',
        name: 'Lose Yourself',
        artists: [{ id: 'art-eminem', name: 'Eminem' }],
        album: { id: 'alb-8mile', name: '8 Mile Soundtrack', images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop' }] },
        durationMs: 326000,
        explicit: true,
        popularity: 91,
        uri: 'spotify:track:2EminemLoseYourself02',
        externalUrl: 'https://open.spotify.com/track/2EminemLoseYourself02'
      },
      {
        id: 'hiphop-3',
        name: 'HUMBLE.',
        artists: [{ id: 'art-kendrick', name: 'Kendrick Lamar' }],
        album: { id: 'alb-damn', name: 'DAMN.', images: [{ url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop' }] },
        durationMs: 177000,
        explicit: true,
        popularity: 88,
        uri: 'spotify:track:3KendrickHumble03',
        externalUrl: 'https://open.spotify.com/track/3KendrickHumble03'
      },
      {
        id: 'hiphop-4',
        name: 'In Da Club',
        artists: [{ id: 'art-50cent', name: '50 Cent' }],
        album: { id: 'alb-getrich', name: 'Get Rich or Die Tryin\'', images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop' }] },
        durationMs: 193000,
        explicit: true,
        popularity: 87,
        uri: 'spotify:track:450CentInDaClub04',
        externalUrl: 'https://open.spotify.com/track/450CentInDaClub04'
      },
      {
        id: 'hiphop-5',
        name: 'Sicko Mode',
        artists: [{ id: 'art-travis', name: 'Travis Scott' }],
        album: { id: 'alb-astroworld', name: 'ASTROWORLD', images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' }] },
        durationMs: 312000,
        explicit: true,
        popularity: 88,
        uri: 'spotify:track:5TravisSickoMode05',
        externalUrl: 'https://open.spotify.com/track/5TravisSickoMode05'
      },
      {
        id: 'hiphop-6',
        name: 'God\'s Plan',
        artists: [{ id: 'art-drake', name: 'Drake' }],
        album: { id: 'alb-scorpion', name: 'Scorpion', images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' }] },
        durationMs: 198000,
        explicit: true,
        popularity: 86,
        uri: 'spotify:track:6DrakeGodsPlan06',
        externalUrl: 'https://open.spotify.com/track/6DrakeGodsPlan06'
      }
    ]
  },
  {
    genre: 'mpb',
    keywords: ['mpb', 'bossa nova', 'bossa', 'samba', 'acústico', 'brasil', 'brasileira', 'relaxante', 'domingo', 'jantar'],
    tracks: [
      {
        id: 'mpb-1',
        name: 'Águas de Março',
        artists: [{ id: 'art-elis', name: 'Elis Regina' }, { id: 'art-tom', name: 'Tom Jobim' }],
        album: { id: 'alb-elistom', name: 'Elis & Tom', images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' }] },
        durationMs: 212000,
        explicit: false,
        popularity: 80,
        uri: 'spotify:track:1ElisTomAguas01',
        externalUrl: 'https://open.spotify.com/track/1ElisTomAguas01'
      },
      {
        id: 'mpb-2',
        name: 'Chega de Saudade',
        artists: [{ id: 'art-joao', name: 'João Gilberto' }],
        album: { id: 'alb-chegasaudade', name: 'Chega de Saudade', images: [{ url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&h=300&fit=crop' }] },
        durationMs: 121000,
        explicit: false,
        popularity: 76,
        uri: 'spotify:track:2JoaoChegaSaudade02',
        externalUrl: 'https://open.spotify.com/track/2JoaoChegaSaudade02'
      },
      {
        id: 'mpb-3',
        name: 'Gostava Tanto de Você',
        artists: [{ id: 'art-tim', name: 'Tim Maia' }],
        album: { id: 'alb-timmaia', name: 'Tim Maia 1973', images: [{ url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop' }] },
        durationMs: 256000,
        explicit: false,
        popularity: 81,
        uri: 'spotify:track:3TimMaiaGostava03',
        externalUrl: 'https://open.spotify.com/track/3TimMaiaGostava03'
      },
      {
        id: 'mpb-4',
        name: 'Mas que Nada',
        artists: [{ id: 'art-jorgeben', name: 'Jorge Ben Jor' }],
        album: { id: 'alb-sambaesquema', name: 'Samba Esquema Novo', images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' }] },
        durationMs: 182000,
        explicit: false,
        popularity: 78,
        uri: 'spotify:track:4JorgeBenMasQueNada04',
        externalUrl: 'https://open.spotify.com/track/4JorgeBenMasQueNada04'
      },
      {
        id: 'mpb-5',
        name: 'Sina',
        artists: [{ id: 'art-djavan', name: 'Djavan' }],
        album: { id: 'alb-luz', name: 'Luz', images: [{ url: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=300&h=300&fit=crop' }] },
        durationMs: 334000,
        explicit: false,
        popularity: 79,
        uri: 'spotify:track:5DjavanSina05',
        externalUrl: 'https://open.spotify.com/track/5DjavanSina05'
      },
      {
        id: 'mpb-6',
        name: 'Mina do Condomínio',
        artists: [{ id: 'art-seujorge', name: 'Seu Jorge' }],
        album: { id: 'alb-americabrasil', name: 'América Brasil', images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop' }] },
        durationMs: 393000,
        explicit: false,
        popularity: 82,
        uri: 'spotify:track:6SeuJorgeMinaCondominio06',
        externalUrl: 'https://open.spotify.com/track/6SeuJorgeMinaCondominio06'
      }
    ]
  },
  {
    genre: 'funk',
    keywords: ['funk', 'funk brasileiro', 'baile', 'festa', 'favela', 'paredão', 'fluxo', '150bpm', 'brega funk'],
    tracks: [
      {
        id: 'funk-1',
        name: 'Tipo Gin',
        artists: [{ id: 'art-kevinchris', name: 'MC Kevin o Chris' }],
        album: { id: 'alb-tipogin', name: 'Tipo Gin Single', images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' }] },
        durationMs: 160000,
        explicit: true,
        popularity: 82,
        uri: 'spotify:track:1KevinChrisTipoGin01',
        externalUrl: 'https://open.spotify.com/track/1KevinChrisTipoGin01'
      },
      {
        id: 'funk-2',
        name: 'Dançarina',
        artists: [{ id: 'art-pedrosampaio', name: 'Pedro Sampaio' }, { id: 'art-mcmc', name: 'MC Pedrinho' }],
        album: { id: 'alb-chama', name: 'Chama Meu Nome', images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' }] },
        durationMs: 110000,
        explicit: false,
        popularity: 84,
        uri: 'spotify:track:2PedroSampaioDancarina02',
        externalUrl: 'https://open.spotify.com/track/2PedroSampaioDancarina02'
      },
      {
        id: 'funk-3',
        name: 'Envolver',
        artists: [{ id: 'art-anitta', name: 'Anitta' }],
        album: { id: 'alb-versions', name: 'Versions of Me', images: [{ url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&h=300&fit=crop' }] },
        durationMs: 193000,
        explicit: false,
        popularity: 86,
        uri: 'spotify:track:3AnittaEnvolver03',
        externalUrl: 'https://open.spotify.com/track/3AnittaEnvolver03'
      },
      {
        id: 'funk-4',
        name: 'Malandramente',
        artists: [{ id: 'art-dennis', name: 'Dennis DJ' }, { id: 'art-nandinho', name: 'MC Nandinho' }],
        album: { id: 'alb-malandramente', name: 'Malandramente', images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop' }] },
        durationMs: 154000,
        explicit: true,
        popularity: 77,
        uri: 'spotify:track:4DennisMalandramente04',
        externalUrl: 'https://open.spotify.com/track/4DennisMalandramente04'
      },
      {
        id: 'funk-5',
        name: 'Ilusão (Cracolândia)',
        artists: [{ id: 'art-hariel', name: 'MC Hariel' }, { id: 'art-alok', name: 'Alok' }],
        album: { id: 'alb-ilusao', name: 'Ilusão', images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop' }] },
        durationMs: 236000,
        explicit: false,
        popularity: 83,
        uri: 'spotify:track:5HarielIlusao05',
        externalUrl: 'https://open.spotify.com/track/5HarielIlusao05'
      }
    ]
  },
  {
    genre: 'pagode',
    keywords: ['pagode', 'samba', 'churrasco', 'cerveja', 'fim de semana', 'amigos'],
    tracks: [
      {
        id: 'pagode-1',
        name: 'Falta Você',
        artists: [{ id: 'art-thiaguinho', name: 'Thiaguinho' }],
        album: { id: 'alb-tardezinha', name: 'Tardezinha', images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' }] },
        durationMs: 205000,
        explicit: false,
        popularity: 85,
        uri: 'spotify:track:1ThiaguinhoFaltaVoce01',
        externalUrl: 'https://open.spotify.com/track/1ThiaguinhoFaltaVoce01'
      },
      {
        id: 'pagode-2',
        name: 'Até Que Enfim',
        artists: [{ id: 'art-ferrugem', name: 'Ferrugem' }],
        album: { id: 'alb-prazer', name: 'Prazer, Eu Sou Ferrugem', images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' }] },
        durationMs: 219000,
        explicit: false,
        popularity: 83,
        uri: 'spotify:track:2FerrugemAteQueEnfim02',
        externalUrl: 'https://open.spotify.com/track/2FerrugemAteQueEnfim02'
      },
      {
        id: 'pagode-3',
        name: 'Lapada Dela',
        artists: [{ id: 'art-menosemais', name: 'Grupo Menos É Mais' }],
        album: { id: 'alb-confia', name: 'Confia', images: [{ url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&h=300&fit=crop' }] },
        durationMs: 172000,
        explicit: false,
        popularity: 86,
        uri: 'spotify:track:3MenosEMaisLapada03',
        externalUrl: 'https://open.spotify.com/track/3MenosEMaisLapada03'
      },
      {
        id: 'pagode-4',
        name: 'Deixa Alagar',
        artists: [{ id: 'art-zeca', name: 'Zeca Pagodinho' }],
        album: { id: 'alb-deixaclarear', name: 'Deixa a Vida Me Levar', images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop' }] },
        durationMs: 245000,
        explicit: false,
        popularity: 81,
        uri: 'spotify:track:4ZecaDeixaVida04',
        externalUrl: 'https://open.spotify.com/track/4ZecaDeixaVida04'
      }
    ]
  },
  {
    genre: 'pop',
    keywords: ['pop', 'hits', 'dança', 'comercial', 'rádio', '2020s', 'top brasil', 'global'],
    tracks: [
      {
        id: 'pop-1',
        name: 'Blinding Lights',
        artists: [{ id: 'art-weeknd', name: 'The Weeknd' }],
        album: { id: 'alb-afterhours', name: 'After Hours', images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop' }] },
        durationMs: 200000,
        explicit: false,
        popularity: 93,
        uri: 'spotify:track:1WeekndBlindingLights01',
        externalUrl: 'https://open.spotify.com/track/1WeekndBlindingLights01'
      },
      {
        id: 'pop-2',
        name: 'Levitating',
        artists: [{ id: 'art-dualipa', name: 'Dua Lipa' }],
        album: { id: 'alb-futurenostalgia', name: 'Future Nostalgia', images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' }] },
        durationMs: 203000,
        explicit: false,
        popularity: 90,
        uri: 'spotify:track:2DuaLipaLevitating02',
        externalUrl: 'https://open.spotify.com/track/2DuaLipaLevitating02'
      },
      {
        id: 'pop-3',
        name: 'As It Was',
        artists: [{ id: 'art-harry', name: 'Harry Styles' }],
        album: { id: 'alb-harrys', name: 'Harry\'s House', images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' }] },
        durationMs: 167000,
        explicit: false,
        popularity: 91,
        uri: 'spotify:track:3HarryStylesAsItWas03',
        externalUrl: 'https://open.spotify.com/track/3HarryStylesAsItWas03'
      },
      {
        id: 'pop-4',
        name: 'Billie Jean',
        artists: [{ id: 'art-mj', name: 'Michael Jackson' }],
        album: { id: 'alb-thriller', name: 'Thriller', images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop' }] },
        durationMs: 294000,
        explicit: false,
        popularity: 88,
        uri: 'spotify:track:4MichaelBillieJean04',
        externalUrl: 'https://open.spotify.com/track/4MichaelBillieJean04'
      }
    ]
  },
  {
    genre: 'eletronica',
    keywords: ['eletronica', 'electronic', 'edm', 'house', 'techno', 'balada', 'festival', 'rave'],
    tracks: [
      {
        id: 'edm-1',
        name: 'Levels',
        artists: [{ id: 'art-avicii', name: 'Avicii' }],
        album: { id: 'alb-levels', name: 'Levels', images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' }] },
        durationMs: 198000,
        explicit: false,
        popularity: 87,
        uri: 'spotify:track:1AviciiLevels01',
        externalUrl: 'https://open.spotify.com/track/1AviciiLevels01'
      },
      {
        id: 'edm-2',
        name: 'One (Your Name)',
        artists: [{ id: 'art-shm', name: 'Swedish House Mafia' }],
        album: { id: 'alb-untilone', name: 'Until One', images: [{ url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop' }] },
        durationMs: 169000,
        explicit: false,
        popularity: 82,
        uri: 'spotify:track:2SHMOne02',
        externalUrl: 'https://open.spotify.com/track/2SHMOne02'
      },
      {
        id: 'edm-3',
        name: 'Titanium',
        artists: [{ id: 'art-guetta', name: 'David Guetta' }, { id: 'art-sia', name: 'Sia' }],
        album: { id: 'alb-nothing', name: 'Nothing But the Beat', images: [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' }] },
        durationMs: 245000,
        explicit: false,
        popularity: 86,
        uri: 'spotify:track:3GuettaTitanium03',
        externalUrl: 'https://open.spotify.com/track/3GuettaTitanium03'
      },
      {
        id: 'edm-4',
        name: 'Losing It',
        artists: [{ id: 'art-fisher', name: 'FISHER' }],
        album: { id: 'alb-losingit', name: 'Losing It', images: [{ url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop' }] },
        durationMs: 248000,
        explicit: false,
        popularity: 83,
        uri: 'spotify:track:4FisherLosingIt04',
        externalUrl: 'https://open.spotify.com/track/4FisherLosingIt04'
      }
    ]
  }
];

export function getTracksForQuery(query: string, limit = 20): SpotifyTrack[] {
  const qLower = query.toLowerCase();

  // 1. Procurar correspondência direta por artista ou faixa no catálogo inteiro
  const directMatches: SpotifyTrack[] = [];
  const allTracks: SpotifyTrack[] = [];

  for (const group of RICH_GENRE_CATALOG) {
    for (const track of group.tracks) {
      allTracks.push(track);
      const matchesTrack = track.name.toLowerCase().includes(qLower);
      const matchesArtist = track.artists.some((a) => a.name.toLowerCase().includes(qLower));
      if (matchesTrack || matchesArtist) {
        directMatches.push(track);
      }
    }
  }

  if (directMatches.length > 0) {
    return directMatches.slice(0, limit);
  }

  // 2. Procurar por gênero ou palavras-chave
  for (const group of RICH_GENRE_CATALOG) {
    const matchesKeyword = group.keywords.some((kw) => qLower.includes(kw));
    if (matchesKeyword) {
      // Embaralha levemente para não ser idêntico
      const shuffled = [...group.tracks].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    }
  }

  // 3. Fallback inteligente: se não encontrar gênero específico, gera seleção variada de qualidade
  const shuffledAll = [...allTracks].sort(() => 0.5 - Math.random());
  return shuffledAll.slice(0, limit);
}
