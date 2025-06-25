<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	export let media;

	interface MediaItem {
		id: number | string;
		path: string;
		title: string;
	}

	let isLightboxOpen = false;
	let selectedMedia: MediaItem | null = null;

	function openLightbox(mediaItem: MediaItem) {
		selectedMedia = mediaItem;
		isLightboxOpen = true;
	}

	function closeLightbox() {
		isLightboxOpen = false;
		selectedMedia = null;
	}
</script>

<section id="media" class="snap-start bg-gray-900 px-4 pt-4 pb-12 md:pt-4 md:pb-16 min-h-screen">
	<div class="max-w-5xl mx-auto">
		<h1 class="text-4xl font-bold text-white border-b-2 border-slate-700 pb-4 mb-8">
			Media Gallery
		</h1>

		{#if media && media.length > 0}
			<!-- Masonry-style Layout -->
			<div class="columns-2 md:columns-4 gap-4 space-y-4">
				{#each media.slice(0, 12) as item, i (item.id)}
					<button
						type="button"
						on:click={() => openLightbox(item)}
						class="w-full break-inside-avoid overflow-hidden rounded-lg cursor-pointer group focus:outline-none"
					>
						<img
							src="{PUBLIC_BACKEND_URL}/{item.path}"
							alt={item.title}
							class="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
						/>
					</button>
				{/each}
			</div>
		{:else}
			<p class="text-center text-slate-400">Belum ada media yang diunggah.</p>
		{/if}

		<!-- Tombol SEE MORE -->
		<div class="text-right mt-6">
			<a
				href="/media"
				class="inline-flex items-center justify-center gap-2 border border-slate-600 text-white font-semibold px-6 py-2 rounded hover:bg-slate-700 transition-all text-sm"
			>
				<span>SEE MORE</span>
				<span class="text-base">→</span>
			</a>
		</div>
	</div>
</section>

{#if isLightboxOpen}
	<div
		class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		on:click={closeLightbox}
		on:keydown={(e) => e.key === 'Escape' && closeLightbox()}
	>
		{#if selectedMedia}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<section
				class="relative max-w-4xl max-h-[90vh]"
				on:click|stopPropagation
				role="document"
				aria-label={selectedMedia.title}
			>
				<img
					src="{PUBLIC_BACKEND_URL}/{selectedMedia.path}"
					alt={selectedMedia.title}
					class="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg"
				/>
				<button
					on:click={closeLightbox}
					class="absolute -top-4 -right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold hover:bg-gray-200"
					aria-label="Close"
				>
					&times;
				</button>
			</section>
		{/if}
	</div>
{/if}
