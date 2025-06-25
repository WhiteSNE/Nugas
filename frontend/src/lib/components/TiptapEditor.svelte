<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Underline from '@tiptap/extension-underline';
	import TextAlign from '@tiptap/extension-text-align';
	import Image from '@tiptap/extension-image';
	import Placeholder from '@tiptap/extension-placeholder';

	import { authStore } from '$lib/stores/authStore';
	import { get } from 'svelte/store';

	export let value: object = {};
	export let placeholder: string = 'Tulis sesuatu di sini...';

	let editor: Editor;
	let editorElement: HTMLDivElement;
	let fileInput: HTMLInputElement;
	let isUploading = false;

	let isBoldActive = false;
	let isItalicActive = false;
	let isUnderlineActive = false;
	let isH1Active = false;
	let isH2Active = false;
	let isBulletListActive = false;
	let isOrderedListActive = false;

	const updateActiveStates = () => {
		if (!editor) return;
		isBoldActive = editor.isActive('bold');
		isItalicActive = editor.isActive('italic');
		isUnderlineActive = editor.isActive('underline');
		isH1Active = editor.isActive('heading', { level: 1 });
		isH2Active = editor.isActive('heading', { level: 2 });
		isBulletListActive = editor.isActive('bulletList');
		isOrderedListActive = editor.isActive('orderedList');
	};

	onMount(() => {
		editor = new Editor({
			element: editorElement,
			extensions: [
				StarterKit.configure({
					heading: {
						levels: [1, 2]
					}
				}),
				Underline,
				Image,
				TextAlign.configure({ types: ['heading', 'paragraph'] }),
				Placeholder.configure({
					placeholder: placeholder
				})
			],
			content: value,
			autofocus: true,
			editorProps: {
				attributes: {
					class: 'prose dark:prose-invert max-w-none focus:outline-none'
				}
			},
			onUpdate: ({ editor }) => {
				value = editor.getJSON();
				updateActiveStates();
			},
			onSelectionUpdate: () => {
				updateActiveStates();
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	async function uploadImage(file: File) {
		if (!file) return;

		isUploading = true;
		const formData = new FormData();
		formData.append('image', file);

		const token = get(authStore).token;

		if (!token) {
			alert('Otentikasi dibutuhkan. Mohon login kembali.');
			isUploading = false;
			return;
		}

		try {
			const endpoint = `${PUBLIC_BACKEND_URL}/api/changelogs/upload-image`;
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Gagal mengupload gambar.');
			}

			const result = await response.json();

			if (result.url && editor) {
				editor.chain().focus().setImage({ src: result.url }).run();
			}
		} catch (error) {
			console.error(error);
			alert((error as Error).message);
		} finally {
			isUploading = false;
		}
	}
	
	function onFileSelected(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			uploadImage(target.files[0]);
		}
	}
</script>

<div class="flex flex-col border border-zinc-700 rounded-lg bg-zinc-900 text-white">
	{#if editor}
		<div class="flex flex-wrap items-center gap-2 p-2 border-b border-zinc-700">
			<div class="flex rounded-md overflow-hidden divide-x divide-zinc-700">
				<button
					type="button"
					class="px-3 py-1.5 text-sm font-semibold transition-colors duration-150 {isBoldActive
						? 'bg-blue-600'
						: 'bg-zinc-800 hover:bg-zinc-700'}"
					on:click={() => editor.chain().focus().toggleBold().run()}>B</button
				>
				<button
					type="button"
					class="px-3 py-1.5 text-sm font-semibold transition-colors duration-150 {isItalicActive
						? 'bg-blue-600'
						: 'bg-zinc-800 hover:bg-zinc-700'}"
					on:click={() => editor.chain().focus().toggleItalic().run()}>I</button
				>
				<button
					type="button"
					class="px-3 py-1.5 text-sm font-semibold transition-colors duration-150 {isUnderlineActive
						? 'bg-blue-600'
						: 'bg-zinc-800 hover:bg-zinc-700'}"
					on:click={() => editor.chain().focus().toggleUnderline().run()}>U</button
				>
			</div>

			<div class="flex rounded-md overflow-hidden divide-x divide-zinc-700">
				<button
					type="button"
					class="px-3 py-1.5 text-sm font-semibold transition-colors duration-150 {isH1Active
						? 'bg-blue-600'
						: 'bg-zinc-800 hover:bg-zinc-700'}"
					on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button
				>
				<button
					type="button"
					class="px-3 py-1.5 text-sm font-semibold transition-colors duration-150 {isH2Active
						? 'bg-blue-600'
						: 'bg-zinc-800 hover:bg-zinc-700'}"
					on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button
				>
			</div>

			<div class="flex rounded-md overflow-hidden divide-x divide-zinc-700">
				<button
					type="button"
					class="px-3 py-1.5 text-sm font-semibold transition-colors duration-150 {isBulletListActive
						? 'bg-blue-600'
						: 'bg-zinc-800 hover:bg-zinc-700'}"
					on:click={() => editor.chain().focus().toggleBulletList().run()}>•</button
				>
				<button
					type="button"
					class="px-3 py-1.5 text-sm font-semibold transition-colors duration-150 {isOrderedListActive
						? 'bg-blue-600'
						: 'bg-zinc-800 hover:bg-zinc-700'}"
					on:click={() => editor.chain().focus().toggleOrderedList().run()}>1.</button
				>
			</div>

			<div class="flex rounded-md overflow-hidden divide-x divide-zinc-700">
				<button
					type="button"
					class="px-3 py-1.5 text-sm font-semibold transition-colors duration-150 bg-zinc-800 hover:bg-zinc-700"
					on:click={() => editor.chain().focus().setTextAlign('left').run()}>L</button
				>
				<button
					type="button"
					class="px-3 py-1.5 text-sm font-semibold transition-colors duration-150 bg-zinc-800 hover:bg-zinc-700"
					on:click={() => editor.chain().focus().setTextAlign('center').run()}>C</button
				>
				<button
					type="button"
					class="px-3 py-1.5 text-sm font-semibold transition-colors duration-150 bg-zinc-800 hover:bg-zinc-700"
					on:click={() => editor.chain().focus().setTextAlign('right').run()}>R</button
				>
			</div>

			<div class="flex rounded-md overflow-hidden">
				<button
					type="button"
					disabled={isUploading}
					on:click={() => fileInput?.click()}
					class="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isUploading}
						Uploading...
					{:else}
						🖼️
					{/if}
				</button>
			</div>
		</div>
	{/if}

	<div class="p-4 flex-grow min-h-[200px]" bind:this={editorElement}></div>
</div>

<input
	type="file"
	class="hidden"
	accept="image/jpeg,image/png,image/gif"
	bind:this={fileInput}
	on:change={onFileSelected}
/>