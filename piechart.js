// Pie chart rendering for spending by category
// Requires: <canvas id="spendingPieChart"> in HTML


document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('spendingPieChart');
  const ctx = canvas.getContext('2d');
  const data = {
    labels: ['Groceries', 'Bills', 'Dining', 'Shopping', 'Entertainment', 'Gas', 'Other'],
    values: [504, 430, 160, 322, 120, 180, 323],
    colors: [
      '#ffcdd2', // Groceries
      '#ffe0b2', // Bills
      '#c8e6c9', // Dining
      '#bbdefb', // Shopping
      '#f8bbd0', // Entertainment
      '#ffe082', // Gas
      '#d1c4e9'  // Other
    ]
  };

  // Draw donut chart
  const total = data.values.reduce((a, b) => a + b, 0);
  let startAngle = -0.5 * Math.PI;
  const cx = 160, cy = 160, rOuter = 120, rInner = 60;

  // For hover detection
  let hoveredIndex = null;

  function drawChart(hovered) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startAngle = -0.5 * Math.PI;
    for (let i = 0; i < data.values.length; i++) {
      const sliceAngle = (data.values[i] / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, rInner, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = data.colors[i];
      ctx.globalAlpha = (hovered === i) ? 0.85 : 1;
      ctx.shadowColor = (hovered === i) ? '#888' : 'transparent';
      ctx.shadowBlur = (hovered === i) ? 16 : 0;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      startAngle += sliceAngle;
    }
    // Center text
    ctx.font = 'bold 1.2rem Segoe UI, Arial, sans-serif';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Spending', cx, cy - 10);
    ctx.font = '1rem Segoe UI, Arial, sans-serif';
    ctx.fillText('by Category', cx, cy + 16);
  }

  // Draw floating legend below chart
  function drawLegend() {
    let legend = document.getElementById('pie-legend');
    if (!legend) {
      legend = document.createElement('div');
      legend.id = 'pie-legend';
      legend.style.display = 'flex';
      legend.style.flexWrap = 'wrap';
      legend.style.justifyContent = 'center';
      legend.style.gap = '1.2rem';
      legend.style.margin = '1rem auto 0 auto';
      legend.style.maxWidth = '320px';
      legend.style.fontSize = '1rem';
      canvas.parentNode.appendChild(legend);
    }
    legend.innerHTML = '';
    for (let i = 0; i < data.labels.length; i++) {
      const item = document.createElement('span');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.innerHTML = `<span style="display:inline-block;width:16px;height:16px;background:${data.colors[i]};border-radius:4px;margin-right:7px;"></span>${data.labels[i]}`;
      legend.appendChild(item);
    }
  }

  // Tooltip
  const tooltip = document.createElement('div');
  tooltip.style.position = 'fixed';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.background = 'rgba(34,34,34,0.97)';
  tooltip.style.color = '#fff';
  tooltip.style.padding = '7px 14px';
  tooltip.style.borderRadius = '7px';
  tooltip.style.fontSize = '1rem';
  tooltip.style.zIndex = 1000;
  tooltip.style.transition = 'opacity 0.15s';
  tooltip.style.opacity = 0;
  document.body.appendChild(tooltip);

  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    const dist = Math.sqrt(x * x + y * y);
    let angle = Math.atan2(y, x);
    if (angle < -0.5 * Math.PI) angle += 2 * Math.PI;
    let found = null;
    if (dist >= rInner && dist <= rOuter) {
      let a = -0.5 * Math.PI;
      for (let i = 0; i < data.values.length; i++) {
        const slice = (data.values[i] / total) * 2 * Math.PI;
        if (angle >= a && angle < a + slice) {
          found = i;
          break;
        }
        a += slice;
      }
    }
    if (found !== null) {
      hoveredIndex = found;
      drawChart(hoveredIndex);
      tooltip.innerHTML = `<b>${data.labels[found]}</b><br>$${data.values[found]}<br>${((data.values[found]/total)*100).toFixed(1)}%`;
      tooltip.style.left = (e.clientX + 12) + 'px';
      tooltip.style.top = (e.clientY - 10) + 'px';
      tooltip.style.opacity = 1;
    } else {
      hoveredIndex = null;
      drawChart(null);
      tooltip.style.opacity = 0;
    }
  });
  canvas.addEventListener('mouseleave', function () {
    hoveredIndex = null;
    drawChart(null);
    tooltip.style.opacity = 0;
  });

  drawChart(null);
  drawLegend();
});
