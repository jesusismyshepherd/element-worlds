// Periodic Videos (Brady Haran with Professor Sir Martyn Poliakoff and colleagues, University of Nottingham):
// each element's video, played in YouTube's own player in its Periodic Videos room, and the moments its
// experiments start (docs/knowledge/periodic-videos.md; the times come from watching it: docs/pv/<Symbol>.md).
export const PLAYLIST = 'PL7A1F4CF36C085DE1'
export const SITE = 'http://www.periodicvideos.com/'

export const VIDEOS = {
  Na: {
    id: '7IT2I3LtlNE',
    year: 2010,
    length: 282,
    // where each station's part of the video starts (s): a cut, a fade, or the first word of it
    parts: { tin: 0, bowl: 64.5, window: 134, lamp: 179.5, bang: 206.2, note: 258 },
    // where the professor says each of his lines (prof.lines in the words)
    prof: [26, 36, 58, 134, 178, 258],
  },
}

/** The rooms that exist: an element with a video and its stations. */
export const ROOMS = ['Na']

export const embedUrl = (id, start = 0) =>
  `https://www.youtube-nocookie.com/embed/${id}?start=${Math.floor(start)}&autoplay=1&rel=0&playsinline=1`
export const watchUrl = (id, start = 0) => `https://www.youtube.com/watch?v=${id}${start ? `&t=${Math.floor(start)}s` : ''}`
export const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
