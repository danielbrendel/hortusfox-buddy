<!doctype html>
<html lang="{{ getLocale() }}">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-with, initial-scale=1.0">
		<meta name="description" content="{{ env('APP_DESCRIPTION') }}">
		<meta name="author" content="{{ env('APP_AUTHOR') }}">
		
		<title>{{ env('APP_NAME') }}: {{ env('APP_DESCRIPTION') }}</title>

		<link rel="icon" type="image/png" href="{{ asset('img/logo.png') }}"/>
		<link rel="stylesheet" type="text/css" href="{{ asset('css/bulma.css') }}"/>

		<script src="{{ asset('js/fontawesome.js') }}"></script>
		<script src="{{ asset('js/vue.js') }}"></script>
	</head>
	
	<body>
		<main id="main">
			@include('header.php')

			<div class="container">
                <div class="columns">
                    <div class="column is-2"></div>

                    <div class="column is-8">
                        {%content%}
                    </div>

                    <div class="column is-2"></div>
                </div>
            </div>

			@include('footer.php')
		</main>

		<script src="{{ asset('js/app.js') }}"></script>
		<script>
			document.addEventListener('DOMContentLoaded', () => {

			});
		</script>
	</body>
</html>