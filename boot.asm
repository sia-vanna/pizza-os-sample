; Multiboot2 header — must be in first 8k, 8-byte aligned
section .multiboot
align 8
multiboot_start:
    dd 0xe85250d6          ; magic
    dd 0                   ; i386
    dd multiboot_end - multiboot_start ; header length
    dd -(0xe85250d6 + 0 + (multiboot_end - multiboot_start)) ; checksum

    ; end tag
    dw 0    ; type = 0 (end)
    dw 0    ; flags
    dd 8    ; size
multiboot_end:

section .text
global _start
extern kernel_main

_start:
    cli
    mov esp, stack_top
    mov ebp, esp
    call kernel_main
.hang:
    cli
    hlt
    jmp .hang

section .bss
align 16
stack_bottom:
    resb 16384
stack_top:
