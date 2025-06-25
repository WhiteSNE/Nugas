<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

    const customError = derived(page, ($page) => {
		const err = $page.error as { status?: number; message?: string };
		return {
			status: err?.status ?? 500,
			message: err?.message ?? 'Terjadi kesalahan tak dikenal'
		};
	});
</script>

<div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center text-center p-6">
        <img src="/error/404.svg"  alt="Not Found Icon" class="w-40 h-40 mx-auto mb-8 opacity-80"/>
	<div class="max-w-lg">
		{#await customError then err}
	<h1 class="text-9xl font-black text-cyan-400 tracking-wider">
		{err.status}
	</h1>

	<h2 class="mt-4 text-3xl font-bold text-slate-200 uppercase">
		{err.message}
	</h2>
        {/await}
        
		<p class="mt-4 text-lg text-slate-400">
			Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin telah dipindahkan, dihapus, atau
			Anda salah mengetik alamat.
		</p>

		<div class="mt-10">
			<a
				href="/"
				class="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform hover:scale-105"
			>
				Kembali ke Homepage
			</a>
		</div>
	</div>
</div>

<style>
	h1 {
		text-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
	}
</style>