<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData, SubmitFunction } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// --- State untuk fitur baru ---
	let showUploadForm = false; // Mengontrol visibilitas form upload
	let isLightboxOpen = false; // Mengontrol visibilitas preview gambar
	let selectedImage: any = null; // Menyimpan data gambar yang sedang di-preview

	// --- Fungsi untuk Lightbox (Preview Gambar) ---
	function openLightbox(image: any) {
		selectedImage = image;
		isLightboxOpen = true;
	}

	function closeLightbox() {
		isLightboxOpen = false;
		selectedImage = null;
	}

	// --- Fungsi untuk Form ---
	const handleUploadSubmit: SubmitFunction = ({ formElement }) => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data && 'newMedia' in result.data) {
				const newMediaItem: any = result.data.newMedia;
				data.media = [newMediaItem, ...data.media]; // Tambahkan ke galeri
				showUploadForm = false; // Sembunyikan form setelah sukses
			}
			await update(); // Terapkan hasil untuk menampilkan pesan
		};
	};

	function confirmDelete(event: MouseEvent) {
		if (!confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
			event.preventDefault();
		}
	}
</script>

<svelte:window on:keydown={(e) => e.key === 'Escape' && closeLightbox()} />

<div class="flex justify-between items-center mb-6">
	<h1 class="text-3xl font-bold">Manage Media</h1>
	<button
		type="button"
		on:click={() => (showUploadForm = !showUploadForm)}
		class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
			<path
				d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
			/>
		</svg>
		Upload New Image
	</button>
</div>

{#if showUploadForm}
	<div class="bg-gray-800 p-6 rounded-lg mb-8">
		<h2 class="text-xl font-semibold mb-4">Upload New Image</h2>
		<form method="POST" action="?/upload" enctype="multipart/form-data" use:enhance={handleUploadSubmit}>
			{#if form?.message && !form.newMedia}
				<div
					class="p-3 rounded-md mb-4 {form.success
						? 'bg-green-500/20 text-green-300'
						: 'bg-red-500/20 text-red-300'}"
				>
					{form.message}
				</div>
			{/if}

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="md:col-span-2">
					<label for="title" class="block mb-2 text-sm font-medium text-slate-300"
						>Image Title</label
					>
					<input
						type="text"
						id="title"
						name="title"
						required
						class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label for="image" class="block mb-2 text-sm font-medium text-slate-300"
						>Image File</label
					>
					<input
						type="file"
						id="image"
						name="image"
						required
						accept="image/*"
						class="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
					/>
				</div>
			</div>
			<div class="flex justify-end gap-4 mt-4">
				<button
					type="button"
					on:click={() => (showUploadForm = false)}
					class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition-colors"
				>
					Cancel
				</button>
				<button
					type="submit"
					class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
				>
					Upload
				</button>
			</div>
		</form>
	</div>
{/if}

<div class="border-t border-gray-700 pt-6">
	<h2 class="text-xl font-semibold mb-4">Existing Gallery</h2>
	{#if data.error}
		<p class="text-center text-red-400">{data.error}</p>
	{:else if !data.media || data.media.length === 0}
		<p class="text-center text-slate-400">Belum ada media yang diunggah.</p>
	{:else}
		<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
			{#each data.media as item (item.id)}
				<div
					class="group relative aspect-square overflow-hidden rounded-lg bg-gray-800 border border-gray-700"
				>
					<button
						type="button"
						on:click={() => openLightbox(item)}
						class="w-full h-full block cursor-pointer"
					>
						<img
							src="{PUBLIC_BACKEND_URL}/{item.path}"
							alt={item.title}
							class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					</button>
					<div
						class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={item.id} />
							<button
								type="submit"
								class="bg-red-600/80 hover:bg-red-600 text-white rounded-full p-2 leading-none"
								aria-label="Delete image"
								on:click|stopPropagation={confirmDelete}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-4 h-4"
								>
									<path
										fill-rule="evenodd"
										d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 1 0 .53 1.405A11.98 6.113 3 13.75a.75.75 0 0 0 1.5 0c0-.434.03-.865.09-1.294a.75.75 0 0 0-1.488-.195A10.48 12.013 3 13.75a.75.75 0 0 0 1.5 0c0-1.35.25-2.65.7-3.856a.75.75 0 1 0-1.4-.552A11.022 9.805 3.002 11.25a.75.75 0 0 0 1.5 0c0-2.01.52-3.924 1.42-5.58a.75.75 0 0 0-1.342-.748 10.99 8.683 5.25.002a.75.75 0 0 0-1.498-.059 12.49 7.633 3.75 0c-.23.63-.38 1.29-.46 1.97v.443A2.75 2.75 0 0 0 8.75 1Z"
										clip-rule="evenodd"
									/>
									<path
										d="M14.28 9.58a.75.75 0 0 0-1.06-1.06l-1.47 1.47-1.47-1.47a.75.75 0 0 0-1.06 1.06l1.47 1.47-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06l-1.47-1.47 1.47-1.47Z"
									/>
								</svg>
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

{#if isLightboxOpen && selectedImage}
	<div
		class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
		on:click={closeLightbox}
		role="dialog"
		aria-modal="true"
		autofocus
	>
		<div class="relative" on:click|stopPropagation>
			<img
				src="{PUBLIC_BACKEND_URL}/{selectedImage.path}"
				alt={selectedImage.title}
				class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
			/>
			<div
				class="absolute -bottom-10 left-0 right-0 text-center text-white/80 text-sm p-2 bg-black/20"
			>
				{selectedImage.title}
			</div>
			<button
				on:click={closeLightbox}
				class="absolute -top-3 -right-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold hover:bg-gray-200"
				aria-label="Close"
			>
				&times;
			</button>
		</div>
	</div>
{/if}