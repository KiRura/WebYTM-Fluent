export async function fetchLyrics(title: string, artist: string) {
	try {
		const cleanTitle = title.replace(/\s*[(-[].*?[)-]].*/, "").trim();
		const cleanArtist = artist
			.replace(/\s*[(-[].*?[)-]].*/, "")
			.trim()
			.split("、")[0];
		const query = encodeURIComponent(`${cleanTitle} ${cleanArtist}`);

		const response = await fetch(`https://lrclib.net/api/search?q=${query}`);
		const data: {
			id: number;
			name: string;
			trackName: string;
			artistName: string;
			albumName: string;
			duration: number;
			instrumental: boolean;
			plainLyrics: null | string;
			syncedLyrics: null | string;
		}[] = await response.json();

		let match = data.find((item) => {
			if (!item.syncedLyrics || !cleanArtist) return false;
			const itemArtist = item.artistName.toLowerCase();
			const targetArtist = cleanArtist.toLowerCase();
			const isArtistMatch =
				itemArtist.includes(targetArtist) || targetArtist.includes(itemArtist);
			const itemTitle = item.trackName.toLowerCase();
			const targetTitle = cleanTitle.toLowerCase();
			const isTitleMatch =
				itemTitle.includes(targetTitle) || targetTitle.includes(itemTitle);
			return isArtistMatch && isTitleMatch;
		});

		if (!match) match = data.find((item) => item.syncedLyrics);
		if (match?.syncedLyrics) return parseLRC(match.syncedLyrics);

		return [{ time: 0, text: match?.plainLyrics ?? "Lyrics not found" }];
	} catch (_e) {
		return [{ time: 0, text: "" }];
	}
}

function parseLRC(lrc: string) {
	const lines = lrc.split("\n");
	const result = [];
	const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
	for (const line of lines) {
		const match = line.match(timeRegex);
		if (match?.[1] && match[2] && match[3]) {
			const time =
				parseInt(match[1], 10) * 60 +
				parseInt(match[2], 10) +
				parseInt(match[3], 10) / 100;
			const text = line.replace(timeRegex, "").trim();
			if (text) result.push({ time, text });
		}
	}
	return result;
}
