<div class="features">
    <h2><i class="fas fa-star"></i> Cool features for plant enthusiasts!</h2>

    <div class="feature-list">
        <div class="feature-item">
            <div class="feature-item-icon"><i class="fas fa-microscope fa-3x"></i></div>
            <div class="feature-item-info">Plant Identification</div>
        </div>

        <div class="feature-item">
            <div class="feature-item-icon"><i class="fas fa-gamepad fa-3x"></i></div>
            <div class="feature-item-info">Plant Game</div>
        </div>

        <div class="feature-item">
            <div class="feature-item-icon"><i class="fas fa-chart-bar fa-3x"></i></div>
            <div class="feature-item-info">Usage stats</div>
        </div>
    </div>
</div>

<div class="documentation">
    <a name="documentation"></a>

    <h2><i class="fas fa-caret-square-right"></i> How does it work?</h2>

    <ol>
        <li><a href="{{ env('APP_INVITELINK') }}">Add the Bot</a> to your Discord server</li>

        <li>When the bot has joined your server, do the following setup commands</strong>
            <ol>
                <li><strong>/hfbud set apikey (your-api-key)</strong> to set your Pl@ntNet API key</li>
                <li><strong>/hfbud set recchan (channel name)</strong> to set the plant recognition channel</li>
                <li><strong>/hfbud set gamechan (channel name)</strong> to set the plant guessing game channel</li>
            </ol>
        </li>

        <li>You can then run the following additional admin commands</strong>
            <ol>
                <li><strong>/hfbud game start</strong> Start the plant guessing game</li>
                <li><strong>/hfbud game stop</strong> Stop the plant guessing game</li>
                <li><strong>/hfbud game leaderboard</strong> Show leaderboard and end current session. Scores will be reset.</li>
                <li><strong>/hfbud stats</strong> to see the current bot statistics for your server</li>
            </ol>
        </li>

        <li>These commands are available to anyone</strong>
            <ol>
                <li><strong>/guess (plant name)</strong> Guess the plant name of a currently appeared plant</li>
                <li><strong>/plantscore</strong> to see a members current plant guessing game score</li>
                <li><strong>/hortusbuddy</strong> can be used by anyone to print general information about the bot</li>
            </ol>
        </li>
        
        <li>The bot is now ready for service!</li>
        <li>Join the <a href="{{ env('LINK_DISCORD') }}">HortusFox discord server</a> for support!</li>
    </ol>
</div>

@if (env('APP_ENABLESPONSORING'))
<div class="sponsoring">
    <h2><i class="fas fa-heart"></i> Your support is greatly appreciated</h2>

    <div>
        <div class="sponsoring-item">
            <iframe src="https://github.com/sponsors/danielbrendel/button" title="Sponsor danielbrendel" height="32" width="114" style="border: 0; border-radius: 6px;"></iframe>
        </div>

        <div class="sponsoring-item">
            <a href='https://ko-fi.com/C0C7V2ESD' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
        </div>
    </div>
</div>
@endif