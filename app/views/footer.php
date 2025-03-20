<div class="page-footer">
    <div class="columns">
        <div class="column is-3"></div>

        <div class="column is-3">
            <div class="is-margin-bottom-10">&copy; {{ date('Y') }} by {{ env('APP_AUTHOR') }}.</div>

            <div>
                {{ env('APP_NAME') }} is released under the MIT license.
                It is powered by <a href="{{ env('LINK_HOMEPAGE') }}">HortusFox</a>, the free and open-sourced, selfhosted collaborative management system
                for indoor and outdoor plants.
            </div>
        </div>

        <div class="column is-3 is-desktop-right">
            <span>
                <a href="{{ env('LINK_GITHUB') }}" target="_blank">
                    <i class="fab fa-github fa-2x"></i>
                </a>
            </span>

            <span>
                <a href="{{ env('LINK_HOMEPAGE') }}" target="_blank">
                    <i class="fas fa-globe fa-2x"></i>
                </a>
            </span>

            <span>
                <a href="{{ env('LINK_YOUTUBE') }}" target="_blank">
                    <i class="fab fa-youtube fa-2x"></i>
                </a>
            </span>

            <span>
                <a href="{{ env('LINK_DISCORD') }}" target="_blank">
                    <i class="fab fa-discord fa-2x"></i>
                </a>
            </span>

            <span>
                <a href="{{ env('LINK_MASTODON') }}" target="_blank">
                    <i class="fab fa-mastodon fa-2x"></i>
                </a>
            </span>

            <span>
                <a href="{{ env('LINK_PIXELFED') }}" target="_blank">
                    <i class="fas fa-camera fa-2x"></i>
                </a>
            </span>
        </div>

        <div class="column is-3"></div>
    </div>
</div>