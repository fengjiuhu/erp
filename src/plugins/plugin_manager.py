"""Plugin manager stub."""

PLUGINS = []


def load(plugin):
    PLUGINS.append(plugin)
    return plugin
