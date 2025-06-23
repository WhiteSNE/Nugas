<script lang="ts">
    import { onMount } from 'svelte';
    import { PUBLIC_BACKEND_URL } from '$env/static/public';
    
    export let data;
    let token = '';
    let name = '';
    let password = '';
    let confirmPassword = '';
    let email = '';
    let message = '';
    let messageType: 'success' | 'error' | '' = '';
    let isSubmitting = false;
    
    onMount(() => {
      // Get token from URL query string
      const urlParams = new URLSearchParams(window.location.search);
      token = urlParams.get('token') || '';
      
      if (!token) {
        message = 'Missing verification token';
        messageType = 'error';
      }
    });
    
    async function handleSubmit() {
      if (password !== confirmPassword) {
        message = 'Passwords do not match';
        messageType = 'error';
        return;
      }
      
      isSubmitting = true;
      message = '';
      messageType = '';
      
      try {
        const response = await fetch(`${PUBLIC_BACKEND_URL}/api/registrations/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token, name, password })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          message = result.message;
          messageType = 'success';
          email = result.user.email;
        } else {
          message = result.error || 'Verification failed';
          messageType = 'error';
        }
      } catch (error) {
        message = 'Network error. Please try again.';
        messageType = 'error';
      } finally {
        isSubmitting = false;
      }
    }
  </script>
  
  <main class="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-slate-800 p-8 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-white mb-6">Complete Your Registration</h1>
      
      {#if messageType === 'success'}
        <div class="bg-green-900 text-green-400 p-4 rounded-lg mb-6">
          {message}
          {#if email}
            <p class="mt-2">Your email: {email}</p>
          {/if}
        </div>
        <a href="/login" class="block w-full bg-blue-600 text-white text-center py-3 rounded-lg">
          Go to Login
        </a>
      {:else}
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          {#if message}
            <div class={`p-4 rounded-lg mb-4 ${
              messageType === 'error' 
                ? 'bg-red-900 text-red-400' 
                : 'bg-blue-900 text-blue-400'
            }`}>
              {message}
            </div>
          {/if}
          
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              bind:value={name}
              required
              class="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              bind:value={password}
              required
              minlength="8"
              class="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              bind:value={confirmPassword}
              required
              class="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
          </div>
          
          <input
            type="hidden"
            bind:value={token}
          />
          
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            disabled={isSubmitting || !token}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      {/if}
    </div>
  </main>