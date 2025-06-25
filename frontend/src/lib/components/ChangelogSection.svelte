<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { browser } from '$app/environment';
	import { onMount, tick } from 'svelte';
	import Swiper from 'swiper';
	import { Navigation, Pagination, Autoplay } from 'swiper/modules';
	import type { Swiper as SwiperType } from 'swiper';

	import 'swiper/css';
	import 'swiper/css/navigation';
	import 'swiper/css/pagination';

	export let initialChangelogs: any[] = [];

	let changelogs = initialChangelogs;
	let activeFilter = 'LATEST';
	const filters = ['LATEST', 'ANNOUNCEMENT', 'UPDATE', 'BUGFIX', 'MAINTENANCE'];
	let swiperInstance: SwiperType | null = null;
    let swiperEl: HTMLElement;

	$: featuredItems = changelogs?.filter(c => c.bannerImageUrl) ?? [];
	$: carouselItems = featuredItems.slice(0, 5);
	$: gridItems = changelogs?.slice(0, 6) ?? [];
	$: hasMoreItems = changelogs && changelogs.length > 6;
	$: moreLink =
		activeFilter.toLowerCase() === 'latest'
			? '/changelogs'
			: `/changelogs?category=${activeFilter.toLowerCase()}`;

	async function loadChangelogs(category: string) {
		activeFilter = category;
		try {
			const param = category.toLowerCase() !== 'latest' ? `?category=${category.toLowerCase()}` : '';
			const endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs${param}`;
			const res = await fetch(endpoint);
			if (!res.ok) throw new Error('Failed to fetch changelogs');
			changelogs = await res.json();
		} catch (e) {
			console.error('Failed to fetch changelogs:', e);
			changelogs = [];
		}
	}

	function formatDate(dateString: string): string {
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('id-ID', options);
	}

	function initializeSwiper() {
		if (swiperInstance) {
			swiperInstance.destroy(true, true);
		}
		if (swiperEl) { 
			swiperInstance = new Swiper(swiperEl, {
				modules: [Navigation, Pagination, Autoplay],
				loop: carouselItems.length > 1,
				slidesPerView: 'auto',
				centeredSlides: true,
				spaceBetween: 20,
				autoplay: { delay: 4000, disableOnInteraction: false },
				pagination: { el: '.swiper-pagination', clickable: true },
				navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
			});
		}
	}

	onMount(() => {
		initializeSwiper();
	});

	$: if (browser && carouselItems) {
		(async () => {
			await tick();
			initializeSwiper();
		})();
	}
</script>

<section id="changelogs" class="snap-start min-h-screen bg-slate-900 px-4 py-16 flex items-center justify-center">
	<div class="w-full max-w-5xl flex flex-col">
		<div class="relative z-20 flex justify-between items-center border-b-2 border-slate-700 pb-3 mb-6">
			<h1 class="text-2xl md:text-3xl font-bold text-white">Changelogs & News</h1>
			<div class="flex items-center gap-2 md:gap-4">
				{#each filters as filter}
					<button
						type="button"
						on:click={() => loadChangelogs(filter)}
						class="text-xs md:text-sm font-semibold px-3 py-1 rounded-full transition-colors"
						class:bg-cyan-500={activeFilter === filter}
						class:text-white={activeFilter === filter}
						class:bg-slate-800={activeFilter !== filter}
						class:text-slate-400={activeFilter !== filter}
						class:hover:bg-slate-700={activeFilter !== filter}
					>
						{filter}
					</button>
				{/each}
			</div>
		</div>

		<div class="flex-grow relative z-10">
			{#if changelogs && changelogs.length > 0}
				{#if carouselItems.length > 0}
					<div
                        bind:this={swiperEl}
						class="swiper changelog-swiper relative w-full aspect-[16/5] min-h-[200px] rounded-lg overflow-hidden mb-6 bg-slate-800"
					>
						<div class="swiper-wrapper">
							{#each carouselItems as item (item.id)}
								<div class="swiper-slide !w-[80%] md:!w-[70%]">
									<a
										href={`/changelogs/${item.id}`}
										class="group block w-full h-full relative bg-slate-800 rounded-lg overflow-hidden"
									>
                                        <img
											src="{item.bannerImageUrl
												? `${PUBLIC_BACKEND_URL}/${item.bannerImageUrl}`
												: '/placeholder.jpg'}"
											alt={item.title}
											class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
										/>
										<div
											class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
										></div>
										<div class="absolute bottom-0 left-0 p-4 md:p-6 text-white w-full">
											<p class="text-xs md:text-sm text-slate-300 font-mono">
												{formatDate(item.created_at)}
											</p>
											<p class="text-lg md:text-xl font-bold mt-1 line-clamp-2">{item.title}</p>
											<p class="text-sm font-semibold mt-3 text-cyan-400 group-hover:underline">
												READ MORE +
											</p>
										</div>
									</a>
								</div>
							{/each}
						</div>
						<div class="swiper-button-prev text-white after:!text-2xl !w-10 !h-10"></div>
						<div class="swiper-button-next text-white after:!text-2xl !w-10 !h-10"></div>
						<div class="swiper-pagination"></div>
					</div>
				{/if}

				{#if gridItems.length > 0}
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{#each gridItems as changelog (changelog.id)}
							<a
								href={`/changelogs/${changelog.id}`}
								class="group flex flex-col bg-slate-800 border border-slate-700 rounded-md overflow-hidden hover:-translate-y-1 transition-transform p-4"
							>
								<div class="flex justify-between items-center text-xs mb-2">
									<span class="uppercase text-cyan-400 font-semibold">{changelog.category}</span>
									<span class="text-slate-400 font-mono">{formatDate(changelog.created_at)}</span>
								</div>
								<h3 class="text-white font-bold text-base leading-tight line-clamp-2 mb-3 flex-grow">
									{changelog.title}
								</h3>
								<div class="mt-auto">
									<span
										class="inline-block text-xs text-cyan-500 font-semibold transition group-hover:underline"
										>READ MORE +</span
									>
								</div>
							</a>
						{/each}
					</div>
				{/if}

				{#if hasMoreItems}
					<div class="flex justify-end h-auto mt-4">
						<a
							href={moreLink}
							class="inline-flex items-center justify-center gap-2 border border-slate-600 text-white font-semibold px-6 py-2 rounded hover:bg-slate-700 transition-all text-sm"
						>
							<span class="text-base">→</span> MORE
						</a>
					</div>
				{/if}
			{:else}
				<p class="text-center text-slate-400 py-20">Tidak ada item yang cocok dengan filter ini.</p>
			{/if}
		</div>
	</div>
</section>


