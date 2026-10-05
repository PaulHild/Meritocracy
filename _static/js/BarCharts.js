// Shared bar-chart helper for the feedback pages (Round_Feedback,
// Round_PublicGoods, PGG_Beliefs, Part I Final_Results).
//
// Every value is printed directly above its bar, so participants can read the
// numbers without having to hover over the chart.
//
// Requires Chart.js v4 to be loaded first.

// Default colour scheme — matches the legend dots in the multiplier tables.
const BAR_BG = ['rgba(76,175,80,0.8)', 'rgba(91,155,213,0.8)', 'rgba(255,179,71,0.8)'];
const BAR_BORDER = ['#388E3C', '#2E75B6', '#E8923A'];
const MEMBERS = ['You', 'Group member 2', 'Group member 3'];

// width / height. 1.2 makes each chart taller than it is wide, roughly
// 250px tall in the 300px-wide feedback columns (was 150px).
const DEFAULT_ASPECT_RATIO = 1.2;

// Chart.js plugin: draw each bar's value just above the bar.
// Written inline rather than pulling in chartjs-plugin-datalabels, so the pages
// keep a single external dependency.
const barValueLabels = {
    id: 'barValueLabels',
    afterDatasetsDraw(chart, args, opts) {
        const decimals = (opts && opts.decimals) || 0;
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = '600 12px system-ui, -apple-system, "Segoe UI", sans-serif';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        chart.data.datasets.forEach(function (dataset, i) {
            const meta = chart.getDatasetMeta(i);
            if (meta.hidden) return;
            meta.data.forEach(function (bar, index) {
                const raw = dataset.data[index];
                if (raw === null || raw === undefined) return;
                const text = Number(raw).toFixed(decimals);
                // Negative bars grow downwards: put the label below instead.
                const below = raw < 0;
                ctx.textBaseline = below ? 'top' : 'bottom';
                ctx.fillText(text, bar.x, bar.y + (below ? 4 : -4));
            });
        });
        ctx.restore();
    }
};

/**
 * Draw a labelled bar chart.
 *
 * @param {string} canvasId  id of the <canvas> element
 * @param {number[]} data    one value per bar
 * @param {string} yLabel    axis title, also used in the tooltip
 * @param {object} [opts]    { labels, bgColors, borderColors, decimals, aspectRatio }
 */
function makeBarChart(canvasId, data, yLabel, opts) {
    opts = opts || {};
    const labels = opts.labels || MEMBERS;
    const decimals = opts.decimals === undefined ? 0 : opts.decimals;
    const el = document.getElementById(canvasId);
    // Some pages keep a chart's markup commented out while still calling this
    // helper; bail out quietly instead of throwing on a null canvas.
    if (!el) return null;
    const ctx = el.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: opts.bgColors || BAR_BG,
                borderColor: opts.borderColors || BAR_BORDER,
                borderWidth: 1.5,
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            // Chart.js defaults to aspectRatio 2 (twice as wide as tall), which
            // left only ~60px of plot area in the three-across layout and made
            // real differences between members hard to see. Values below 1 are
            // taller than wide; pass opts.aspectRatio to override per chart.
            aspectRatio: opts.aspectRatio || DEFAULT_ASPECT_RATIO,
            layout: { padding: { top: 18 } },   // headroom for the value labels
            plugins: {
                legend: { display: false },
                barValueLabels: { decimals: decimals },
                tooltip: {
                    callbacks: {
                        label: c => ` ${Number(c.parsed.y).toFixed(decimals)} ${yLabel}`
                    }
                }
            },
            scales: {
                y: {
                    // DO NOT remove beginAtZero. Truncating the axis would
                    // exaggerate small earnings differences, and by different
                    // amounts in different treatments (Welfare State compresses
                    // earnings the most, so it would be distorted the most).
                    // Make differences clearer with height, not with the scale.
                    beginAtZero: true,
                    grace: '12%',               // keep the top label off the frame
                    title: { display: true, text: yLabel }
                }
            }
        },
        plugins: [barValueLabels]
    });
}
