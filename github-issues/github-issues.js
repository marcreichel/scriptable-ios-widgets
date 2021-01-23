// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: ticket-alt;

let repository = 'marcreichel/scriptable-ios-widgets';
const param = args.widgetParameter;
if (param != null && param.length > 0) {
    repository = param;
}

if (repository) {
    const req = new Request(`https://api.github.com/repos/${repository}`);
    const res = await req.loadJSON();

    const widget = await createWidget(res);

    if (!config.runsInWidget) {
        widget.presentSmall();
    }

    Script.setWidget(widget);
} else {
    const widget = await createEmptyWidget();

    if (!config.runsInWidget) {
        widget.presentSmall();
    }

    Script.setWidget(widget);
}

Script.complete();

async function createWidget(response) {
    const locale = Device.locale().split('_')[0];

    const widget = new ListWidget();
    widget.backgroundColor = Color.black();
    widget.url = `${response.html_url}/issues`;

    const owner = widget.addText(response.owner.login.toUpperCase());
    owner.font = Font.semiboldSystemFont(11);
    owner.textOpacity = 0.5;

    widget.addSpacer(2);

    const name = widget.addText(response.name);
    name.font = Font.systemFont(18);
    name.lineLimit = 2;

    widget.addSpacer(10);

    const issuesCount = widget.addText(response.open_issues_count.toLocaleString(locale));
    issuesCount.font = Font.systemFont(20);
    issuesCount.lineLimit = 1;

    const label = `Issue${ response.open_issues_count !== 1 ? 'S' : ''}`;

    const issuesLabel = widget.addText(label.toUpperCase());
    issuesLabel.font = Font.systemFont(12);
    issuesLabel.textOpacity = 0.5;

    return widget;
}

async function createEmptyWidget() {
    const widget = new ListWidget();
    widget.backgroundColor = Color.black();

    const text = widget.addText('No repository provided');

    return widget;
}
