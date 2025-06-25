<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	let showModal = false;
	let email = '';
	let isSubmitting = false;
	let message = '';
	let messageType: 'success' | 'error' | '' = '';

	async function handlePreRegister() {
		isSubmitting = true;
		message = '';
		messageType = '';

		try {
			const response = await fetch(`${PUBLIC_BACKEND_URL}/api/registrations`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});

			const result = await response.json();

			if (response.ok) {
				message = 'Thank you for pre-registering!';
				messageType = 'success';
				email = '';
			} else {
				message = result?.error || 'An error occurred.';
				messageType = 'error';
			}
		} catch (e) {
			message = 'Network error. Please check your connection.';
			messageType = 'error';
		} finally {
			isSubmitting = false;
		}
	}
  </script>
<section id="home" class="snap-start h-screen relative">
	<div class="absolute inset-0 bg-cover bg-center opacity-80" style="background-image: url('/Hero.png');"></div>
	<div class="absolute inset-0 bg-black/50"></div>

	<div class="relative z-10 h-full flex flex-col justify-center items-center p-4 text-center">
		<div class="space-y-6">
			<h1 class="text-4xl md:text-5xl font-bold text-white">Welcome to the Pre-Register Page</h1>
			<button
				class="bg-white text-black font-bold text-lg md:text-xl py-4 px-12 rounded hover:bg-slate-200 transition-all shadow-md"
				on:click={() => (showModal = true)}
			>
				Pre-Register
			</button>
		</div>
	</div>
</section>

<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-black space-y-4">
			<h2 class="text-xl font-semibold">Enter your email to pre-register</h2>

			<input
				type="email"
				placeholder="you@example.com"
				bind:value={email}
				class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>

			{#if message}
				<p class={`text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
					{message}
				</p>
			{/if}

			<div class="flex justify-end gap-4">
				<button
					class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
					on:click={() => {
						showModal = false;
						email = '';
						message = '';
						messageType = '';
					}}
				>
					Cancel
				</button>
				<button
					class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
					on:click={handlePreRegister}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Submitting...' : 'Submit'}
				</button>
			</div>
		</div>
	</div>
{/if}
