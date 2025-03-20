<div class="header" style="background-image: url('{{ asset('img/background.jpg') }}');">
    <div class="header-overlay">
        <div class="header-content">
            <h1><img src="{{ asset('img/logo.png') }}" alt="logo"/>&nbsp;{{ env('APP_NAME') }}</h1>

            <h2>{{ env('APP_DESCRIPTION') }}</h2>

            <div class="header-actions">
                <span><a class="button is-warning is-large is-rounded is-outlined" href="javascript:void(0);" onclick="window.vue.scrollTo('a[name=documentation]');">Documentation</a></span>
                <span><a class="button is-info is-large is-rounded is-outlined" href="{{ env('APP_INVITELINK') }}">Add to Server</a></span>
            </div>

            <div class="header-info">
                Powered by HortusFox - <a href="https://www.hortusfox.com/">www.hortusfox.com</a>
            </div>
        </div>
    </div>
</div>