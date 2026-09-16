// kernel.cpp — impartial OS kernel
// No stdlib, no prints, just you and hardware

// VGA text buffer at 0xB8000
static volatile unsigned short* vga = (unsigned short*)0xB8000;
static int cursor_x = 0, cursor_y = 0;

void clear() {
    for(int i=0;i<80*25;i++) vga[i]=0x0F00 | ' ';
    cursor_x=cursor_y=0;
}

void putchar(char c, unsigned char color=0x0F) {
    if(c=='\n'){ cursor_x=0; cursor_y++; return; }
    if(cursor_y>=25){ clear(); }
    int idx = cursor_y*80 + cursor_x;
    vga[idx] = (color<<8) | c;
    cursor_x++;
    if(cursor_x>=80){ cursor_x=0; cursor_y++; }
}

void print(const char* s, unsigned char color=0x0F){
    while(*s) putchar(*s++, color);
}

// Your profit logic INSIDE the kernel — no JS yet
struct Order { const char* pizza; int price_cents; };

int calc_profit(Order* orders, int n){
    int total=0;
    for(int i=0;i<n;i++) total+=orders[i].price_cents;
    // cost ~30% avg
    return total - (total*30/100);
}

extern "C" void kernel_main(){
    clear();
    print("hacking-pizza.ca // impartial OS v0.1\n", 0x0A);
    print("------------------------------------\n", 0x08);
    print("No telemetry. No account. No feed.\n\n", 0x07);

    Order sample[] = {{"Pepperoni",1899},{"Meat",2199},{"Cheese",1599}};
    int profit = calc_profit(sample, 3);

    print("C++ kernel loaded @ 1MB\n", 0x0F);
    print("Orders in memory: 3\n", 0x0F);
    print("Profit: $", 0x0F);
    // quick itoa
    char buf[16]; int i=0, p=profit;
    if(p==0) buf[i++]='0';
    else { char rev[16]; int r=0; while(p>0){ rev[r++]='0'+p%10; p/=10; } while(r--) buf[i++]=rev[r]; }
    buf[i]=0;
    print(buf, 0x0A);
    print(" cents\n\n", 0x0A);

    print("Next: load JS runtime from disk...\n", 0x08);
    print("> _", 0x0F);

    while(1) __asm__("hlt");
}